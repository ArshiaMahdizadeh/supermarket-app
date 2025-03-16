from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address, PasswordResetToken
from django.utils.timezone import now

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "is_verified"]
        read_only_fields = ["id", "is_verified"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(
        write_only=True, min_length=8, source="confirmPassword"
    )

    class Meta:
        model = User
        fields = ["name", "email", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data.get("confirmPassword"):
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )
        return user


class AddressSerializer(serializers.ModelSerializer):
    coordinates = serializers.ListField(
        child=serializers.FloatField(), min_length=2, max_length=2, required=False
    )

    class Meta:
        model = Address
        fields = [
            "id",
            "address_type",
            "name",
            "address",
            "city",
            "state",
            "postal_code",
            "is_default",
            "coordinates",
        ]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.latitude and instance.longitude:
            representation["coordinates"] = [instance.latitude, instance.longitude]
        else:
            representation["coordinates"] = None
        return representation

    def create(self, validated_data):
        coordinates = validated_data.pop("coordinates", None)
        if coordinates:
            validated_data["latitude"] = coordinates[0]
            validated_data["longitude"] = coordinates[1]
        return Address.objects.create(**validated_data)

    def update(self, instance, validated_data):
        coordinates = validated_data.pop("coordinates", None)
        if coordinates:
            instance.latitude = coordinates[0]
            instance.longitude = coordinates[1]
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)



class ResetPasswordRequestSerializer(serializers.Serializer):
    """
    Serializer for validating the email in the password reset request.
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        
        normalized_email = value.strip().lower()
        return normalized_email

class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    confirm_password = serializers.CharField(required=True)

    def validate_token(self, value):
        try:
            reset_token = PasswordResetToken.objects.get(
                token=value, expires_at__gt=now()
            )
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired token.")
        return value

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        
        errors = {}
        try:
            from django.contrib.auth.password_validation import validate_password

            validate_password(data["new_password"])
        except serializers.ValidationError as e:
            errors["new_password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)
        return data
