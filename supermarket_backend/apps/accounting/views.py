
from datetime import timedelta
import random
import string


import redis
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.timezone import now
from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.crypto import get_random_string
from apps.accounting.utils import generate_verification_code, send_email_verification


from apps.orders.models import Order
from .models import Address, PasswordResetToken
from .serializers import (
    AddressSerializer,
    ChangePasswordSerializer,
    RegisterSerializer,
    ResetPasswordConfirmSerializer,
    ResetPasswordRequestSerializer,
    UserSerializer,
)


redis_client = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


User = get_user_model()





class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        code = generate_verification_code()
        redis_client.setex(f"verification:{user.email}", 600, code)  
        send_email_verification(user.email, code)  
        return Response(
            {
                "message": "User created. Please check your email for the verification code.",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("verificationCode")
        stored_code = redis_client.get(f"verification:{email}")

        if not stored_code:
            return Response(
                {"error": "Code expired or invalid"}, status=status.HTTP_400_BAD_REQUEST
            )

        if stored_code != code:
            return Response(
                {"error": "Invalid verification code"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
            user.is_verified = True
            user.save()
            redis_client.delete(f"verification:{email}")  
            return Response(
                {"message": "User verified successfully. You can now log in."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )



class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(
            {"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )



class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response(
                {"message": "Password changed successfully."}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        
        print(f"Incoming Request Data: {request.data}")

        
        if isinstance(request.data.get("email"), dict) and "email" in request.data["email"]:
            request.data["email"] = request.data["email"]["email"]

        
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation Errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        email = serializer.validated_data["email"]
        print(f"Normalized Email: {email}")

        try:
            
            user = User.objects.get(email__iexact=email)
            print(f"User Found: {user}")
        except User.DoesNotExist:
            
            return Response(
                {"message": "If the email exists, a reset link has been sent."},
                status=status.HTTP_200_OK,
            )

        
        token = get_random_string(length=32)
        expiry_time = now() + timedelta(hours=24)

        
        PasswordResetToken.objects.create(user=user, token=token, expires_at=expiry_time)
        print("Token Created")

        
        reset_link = f"{settings.FRONTEND_URL}/forgot-password?token={token}"
        print(f"Reset Link: {reset_link}")
        subject = "Password Reset Request"
        message = f"Click the link below to reset your password:\n\n{reset_link}"
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        try:
            send_mail(subject, message, from_email, recipient_list)
            return Response(
                {"message": "If the email exists, a reset link has been sent."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
            

            
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            reset_token = PasswordResetToken.objects.get(token=token, expires_at__gt=now())
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        user = reset_token.user
        user.set_password(new_password)
        user.save()

        
        reset_token.delete()

        return Response(
            {"message": "Password reset successfully."}, status=status.HTTP_200_OK
        )



class CheckEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists}, status=status.HTTP_200_OK)


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response(
                    {"message": "User is already verified."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            code = generate_verification_code()
            redis_client.setex(f"verification:{email}", 600, code)
            send_email_verification(email, code)
            return Response(
                {"message": "Verification email resent."}, status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        
        if response.status_code == 200:
            response.data['message'] = 'Login successful'
        
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
        
        
        

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        
        total_orders = Order.objects.filter(user=user).count()
        total_spent = sum(order.total for order in Order.objects.filter(user=user))

        
        recent_orders = Order.objects.filter(user=user).order_by('-created_at')[:5]

        
        spending_trends = (
            Order.objects.filter(user=user)
            .extra(select={'month': 'strftime("%%Y-%%m", created_at)'})  
            
            .values('month')
            .annotate(total_spent=Sum('total'))
            .order_by('month')
        )

        
        formatted_spending_trends = [
            {"month": entry["month"], "amount": entry["total_spent"]}
            for entry in spending_trends
        ]

        data = {
            "totalOrders": total_orders,
            "totalSpent": total_spent,
            "recentOrders": [
                {
                    "id": order.order_id,
                    "date": order.created_at,
                    "status": order.status,
                    "total": order.total,
                }
                for order in recent_orders
            ],
            "spendingTrends": formatted_spending_trends,
        }

        return Response(data)