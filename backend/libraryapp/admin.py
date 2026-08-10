from django.contrib import admin

# Register your models here.
from . models import *


admin.site.register(Category)
admin.site.register(Author)
admin.site.register(Student)
admin.site.register(Book)
admin.site.register(IssuedBook)