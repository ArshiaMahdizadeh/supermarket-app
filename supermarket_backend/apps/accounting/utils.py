import random
import string
from django.conf import settings
from django.core.mail import send_mail



def generate_verification_code(length=6):
    """Generate a random alphanumeric verification code."""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def send_email_verification(email, code):
    """Send verification code to the user's email."""
    subject = "Verify Your Account"
    message = f"Your verification code is: {code}. Please use this code to verify your account."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    try:
        send_mail(subject, message, from_email, recipient_list)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
