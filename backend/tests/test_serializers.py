from backend.serializers import UserSerializer
from django.contrib.auth.models import User
from django.test import TestCase


class UserSerializerTest(TestCase):
    def test_serializing(self):
        user_1 = User.objects.create(username='user1', email='email@mail.com', password='password')
        user_2 = User.objects.create(username='user2', email='email@mail.com', password='password')
        serialized_data = UserSerializer([user_1, user_2], many=True).data
        expected_data = [
            {
                'id': user_1.id
            },
            {
                'id': user_2.id
            }
        ]
        self.assertEqual(expected_data, serialized_data)
