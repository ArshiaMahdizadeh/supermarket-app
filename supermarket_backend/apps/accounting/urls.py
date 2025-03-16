from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    AddressDetailView,
    AddressListCreateView,
    ChangePasswordView,
    CheckEmailView,
    CustomTokenObtainPairView,
    DashboardView,
    DeleteUserView,
    LogoutView,
    RegisterView,
    ResendVerificationEmailView,
    ResetPasswordConfirmView,
    ResetPasswordRequestView,
    UserProfileView,
    VerifyEmailView,
)

app_name = "accounts"

urlpatterns = [
    # Signup and verification
    path("signup/", RegisterView.as_view(), name="signup"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),
    path( "resend-verification-email/", ResendVerificationEmailView.as_view(), name="resend_verification_email",),
    # Login (JWT token)
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # User profile and settings
    path("account/", UserProfileView.as_view(), name="profile"),
    path("account/delete/", DeleteUserView.as_view(), name="delete_user"),
     path("dashboard/", DashboardView.as_view(), name="dashboard"),
    # Addresses
    path("account/addresses/", AddressListCreateView.as_view(), name="addresses"),
    path( "account/addresses/<int:pk>/",AddressDetailView.as_view(),name="address_detail",),
    # Password management
    path("account/change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("reset-password-request/",ResetPasswordRequestView.as_view(),name="reset_password_request",),
    path("reset-password-confirm/",ResetPasswordConfirmView.as_view(),name="reset_password_confirm",),
    # Utility endpoints
    path("check-email/", CheckEmailView.as_view(), name="check_email"),
]
