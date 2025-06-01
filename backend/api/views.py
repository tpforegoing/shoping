from django.utils import timezone                    #type: ignore
from datetime import timedelta

from rest_framework import status                    #type: ignore 
from rest_framework.authtoken.serializers import AuthTokenSerializer #type: ignore
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny      #type: ignore
from rest_framework.response import Response         #type: ignore

from django.contrib.auth import login                #type: ignore
from django.utils.decorators import method_decorator #type: ignore
from django.views.decorators.csrf import csrf_exempt #type: ignore


from knox.views import LoginView as KnoxLoginView   #type: ignore
from knox.models import AuthToken                   #type: ignore
from django.conf import settings                    #type: ignore 

#https://jazzband.github.io/django-rest-knox/auth/#global-usage-on-all-views
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(KnoxLoginView):

    permission_classes = [AllowAny]
    def post(self, request, format=None):
        """
        Method processes the request to login.

        :param request: Django request object
        :param format: Format of the response
        :return: Response object with JSON data

        The method takes the request and runs it through the AuthTokenSerializer.
        If the serializer is not valid, it returns a response with errors and
        a status of 403. If the serializer is valid, it logs the user in and
        creates a token for the user using the AuthToken model. It then returns
        a response with the token, expiry time, and the user's username.

        The method also sets the user attribute of the request to the user so
        that Knox can use it.
        """
        serializer = AuthTokenSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_403_FORBIDDEN)
        user = serializer.validated_data['user']
        print(f"✅ Авторизований користувач: {user.username}, role: {user.role}")
        
        # Авторизація в системі (щоб Knox знав user)
        login(request, user)
        self.request.user = user  # 🔐 Knox потребує цього
          
        # self.user = serializer.validated_data['user']
        token_tup = AuthToken.objects.create(user)
        token = token_tup[1]
        expiry = timezone.now() + timedelta(seconds=settings.REST_KNOX['TOKEN_TTL'].total_seconds())
        
        return Response({
            "token": token,
            "expiry": expiry,
            "user": {
                "id": user.id,
                "username": user.username,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)
    
