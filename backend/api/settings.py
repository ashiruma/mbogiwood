# mbogiwood_backend/mbogiwood_api/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Django OTP and Two-Factor Authentication (Simplified Integration)
    'django_otp',
    # 'django_otp.admin', # REMOVE or ensure this is COMMENTED OUT
    'django_otp.plugins.otp_totp',
    'django_otp.plugins.otp_static',
    'two_factor', # Ensure this is present
    # 'two_factor.admin', # DO NOT ADD THIS (if it was ever suggested/present)


    'rest_framework',
    'corsheaders',

    'accounts',
    'films',
]
