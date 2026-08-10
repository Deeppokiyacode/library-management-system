from rest_framework import serializers


from . models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "is_active", "created_at","updated_at"]

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name","created_at","updated_at"]


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    # Table me Category aur Author ka naam dikhane ke liye
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'




###   User section   

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class IssuedBookSerializer(serializers.ModelSerializer):
    # Foreign Key se data nikalne ka tarika[cite: 1, 2]
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    book_name = serializers.CharField(source='book.title', read_only=True)
    isbn = serializers.CharField(source='book.isbn', read_only=True)

    class Meta:
        model = IssuedBook
        fields = '__all__'