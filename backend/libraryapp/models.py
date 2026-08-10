from django.db import models


#orm - OBJECT RELATOPNAL MAPPER

class TimeStampedModel(models.Model):
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True   #TimeStampedModel is class ka koi deta base me tale na bane is keliye

 
class Category(TimeStampedModel):
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Author(TimeStampedModel):
    name = models.CharField(max_length=200)
   
    def __str__(self):
        return self.name


class Student(TimeStampedModel):
    student_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    mobile = models.IntegerField()
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)


    def __str__(self):
        return f"{self.student_id} - {self.full_name}"

class Book(TimeStampedModel):
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    author = models.ForeignKey(Author, on_delete=models.PROTECT)   
    isbn = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cover_image = models.ImageField(upload_to="book_covers/", blank=True, null=True)
    is_issued = models.BooleanField(default=False)
    quentity = models.PositiveIntegerField(default=0)



    def __str__(self):
        return f"{self.title} - {self.isbn}"


class IssuedBook(TimeStampedModel):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    issued_at = models.DateTimeField(auto_now_add=True)
    retuened_at = models.DateTimeField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)
    fine = models.PositiveIntegerField(default=0)
    remark = models.TextField(blank=True)
 



    def __str__(self):
        return f"{self.book.title} - {self.student.student_id}"



