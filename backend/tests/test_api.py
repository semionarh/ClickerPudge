from backend.serializers import UserSerializer
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UsersTestCase(APITestCase):
    def test_get_users(self):
        user_1 = User.objects.create(username='user1', email='email@mail.com', password='password')
        user_2 = User.objects.create(username='user2', email='email@mail.com', password='password')
        url = reverse('users_list')
        response = self.client.get(url)
        serialized_data = UserSerializer([user_1, user_2], many=True).data
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(serialized_data, response.data)
        print(response.data)
