
from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.utils import timezone
# Create your views here.

@api_view(["POST"])
def admin_login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response({
            "success": True,
            "message": "Login Successful",
            "username": username
        })

    return Response({
        "success": False,
        "message": "Invalid Credentials"
    }, status=401)


@api_view(["POST"])
def add_category(request):

    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response({
            "success":True,
            "message":"Category Created",
            "category":serializer.data
        },status=201)

    return Response(serializer.errors,status=400)

@api_view(["GET"])
def get_categories(request):

    categories = Category.objects.all().order_by("-id")

    serializer = CategorySerializer(categories, many=True)

    return Response(serializer.data)


@api_view(["PUT"])
def update_category(request, id):

    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Category not found"
            },
            status=404
        )

    serializer = CategorySerializer(
        category,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Category Updated",
                "category": serializer.data
            }
        )

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_category(request, id):

    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Category not found"
            },
            status=404
        )

    category.delete()

    return Response(
        {
            "success": True,
            "message": "Category Deleted"
        }
    )

''' --------------------------- AUTHOR --------------------------------------------'''

@api_view(["POST"])
def add_author(request):
    
    serializer = AuthorSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response({
            "success":True,
            "message":"Author has been Created",
            "author":serializer.data
        },status=201)

    return Response(serializer.errors,status=400)

@api_view(["GET"])
def get_author(request):

    author = Author.objects.all().order_by("-id")

    serializer = AuthorSerializer(author, many=True)

    return Response(serializer.data)


@api_view(["PUT"])
def update_author(request, id):

    try:
        author = Author.objects.get(id=id)
    except Author.DoesNotExist:
        return Response(
            {
                "success": False,
                "message": "Author not found"
            },
            status=404
        )

    serializer = AuthorSerializer(
        author,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Author Updated",
                "author": serializer.data
            }
        )

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def delete_author(request, id):

    try:
        author = Author.objects.get(id=id)
    except Author.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Category not found"
            },
            status=404
        )

    author.delete()

    return Response(
        {
            "success": True,
            "message": "Author Deleted"
        }
    )


@api_view(["POST"])
def add_book(request):
    # request.data me text data aur files dono aate hain
    serializer = BookSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "message": "Book Created Successfully",
            "book": serializer.data
        }, status=201)

    return Response(serializer.errors, status=400)

@api_view(["GET"])
def get_books(request):
    books = Book.objects.all().order_by("-id")
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(["PUT"])
def update_book(request, id):
    try:
        book = Book.objects.get(id=id)
    except Book.DoesNotExist:
        return Response({"success": False, "message": "Book not found"}, status=404)

    # partial=True ka matlab hai ki agar sirf ek field aayi hai, to wahi update hogi
    serializer = BookSerializer(book, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True, 
            "message": "Book Updated Successfully", 
            "book": serializer.data
        })
        
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
def delete_book(request, id):
    try:
        book = Book.objects.get(id=id)
    except Book.DoesNotExist:
        return Response({"success": False, "message": "Book not found"}, status=404)

    book.delete()
    return Response({"success": True, "message": "Book Deleted Successfully"})


# views.py ke niche add karein
from django.contrib.auth.models import User

@api_view(["POST"])
def change_admin_password(request):
    # 1. Frontend se data receive kar rahe hain
    username = request.data.get("username")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    # 2. Check kar rahe hain ki current password sahi hai ya nahi
    # 'authenticate' Django ka in-built function hai jo verify karta hai.
    user = authenticate(username=username, password=old_password)

    # 3. Agar user mil gaya (password sahi tha) aur wo admin(staff) hai
    if user is not None and user.is_staff:
        # Django me password direct save nahi karte, set_password() usko encrypt (hash) kar deta hai
        user.set_password(new_password)
        user.save() # Naya password database me save ho gaya
        
        return Response({
            "success": True,
            "message": "Password changed successfully. Please login with new password next time."
        })
    else:
        # Agar purana password galat nikla
        return Response({
            "success": False,
            "message": "Incorrect current password."
        }, status=400)




#### user section
import random

@api_view(["POST"])
def student_signup(request):
    # Request data ko copy kar rahe hain taaki hum usme student_id add kar sakein
    data = request.data.copy()
    
    # Automatic unique student_id generate karna (e.g., STU45982)
    data['student_id'] = f"STU{random.randint(10000, 99999)}"
    
    serializer = StudentSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True,
            "message": "Registration successful! You can now login."
        }, status=201)
        
    return Response(serializer.errors, status=400)



# views.py ke top par ye import add karein
from django.db.models import Q

# ... aapke baaki imports aur code ...

@api_view(["POST"])
def student_login(request):
    # Frontend se "login_id" aayega (jo email ya student_id kuch bhi ho sakta hai)
    login_id = request.data.get("login_id")
    password = request.data.get("password")

    try:
        # Django 'Q' object ka use karke hum check kar rahe hain: 
        # (email == login_id OR student_id == login_id) AND password == password
        student = Student.objects.get(
            (Q(email=login_id) | Q(student_id=login_id)) & Q(password=password)
        )
        
        # Check karna ki account active hai ya nahi
        if student.is_active:
            return Response({
                "success": True,
                "message": "Login Successful",
                "student": {
                    "student_id": student.student_id,
                    "full_name": student.full_name,
                    "email": student.email
                }
            })
        else:
            return Response({
                "success": False, 
                "message": "Your account is inactive. Please contact the Admin."
            }, status=403)
            
    except Student.DoesNotExist:
        # Agar koi record match nahi hua
        return Response({
            "success": False, 
            "message": "Invalid Email/Student ID or Password"
        }, status=401)



# views.py ke niche add karein

@api_view(['GET'])
def student_dashboard_stats(request, student_id):
    try:
        # Pata lagao ki ye kaunsa student hai[cite: 1]
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)

    # 1. Library me total kitni books hain[cite: 1]
    total_books = Book.objects.count()
    
    # 2. Is student ki kitni books pending hain (jo isne abhi tak wapas nahi ki)[cite: 1]
    pending_returns = IssuedBook.objects.filter(student=student, is_returned=False).count()
    
    # 3. Is student ne total aaj tak kitni books issue karwayi hain[cite: 1]
    total_issued = IssuedBook.objects.filter(student=student).count()

    return Response({
        "success": True,
        "total_books": total_books,
        "pending_returns": pending_returns,
        "total_issued": total_issued
    })


# Profile ka data lana (GET)
@api_view(["GET"])
def get_student_profile(request, student_id):
    try:
        # URL se aayi student_id se database me student dhundho
        student = Student.objects.get(student_id=student_id)
        serializer = StudentSerializer(student)
        return Response({
            "success": True, 
            "student": serializer.data
        })
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)

# Profile update karna (PUT)
@api_view(["PUT"])
def update_student_profile(request, student_id):
    try:
        student = Student.objects.get(student_id=student_id)
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)

    # partial=True ka matlab hai ki hum model ke saare fields nahi bhej rahe, sirf kuch (Name aur Mobile) update kar rahe hain
    serializer = StudentSerializer(student, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            "success": True, 
            "message": "Profile updated successfully!",
            "student": serializer.data
        })
        
    return Response(serializer.errors, status=400)

# views.py ke niche add karein
@api_view(["POST"])
def student_change_password(request):
    student_id = request.data.get("student_id")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    try:
        # Check karte hain ki kya is student_id ka purana password match karta hai
        student = Student.objects.get(student_id=student_id, password=old_password)
        
        # Agar match ho gaya, to naya password set karke save kar do
        student.password = new_password
        student.save()
        
        return Response({
            "success": True,
            "message": "Password changed successfully. Use the new password next time."
        })
    except Student.DoesNotExist:
        # Agar purana password galat hai to object nahi milega
        return Response({
            "success": False,
            "message": "Incorrect current password."
        }, status=400)




# views.py ke niche add karein

@api_view(["GET"])
def get_all_students(request):
    # Saare students ko fetch karna, naye wale sabse upar (order_by "-id")
    students = Student.objects.all().order_by("-id")
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)

@api_view(["PUT"])
def toggle_student_status(request, id):
    try:
        student = Student.objects.get(id=id)
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)

    # Status ko ulta kar dena (True hai to False, False hai to True)
    student.is_active = not student.is_active
    student.save()
    
    status_text = "Active" if student.is_active else "Blocked"
    
    return Response({
        "success": True, 
        "message": f"Student account has been {status_text}."
    })




# views.py ke niche add karein

@api_view(["GET"])
def search_student_for_issue(request, student_id):
    try:
        # Student ID ke base par student dhundhna
        student = Student.objects.get(student_id=student_id)
        if not student.is_active:
            return Response({"success": False, "message": "Student account is blocked!"}, status=400)
        
        serializer = StudentSerializer(student)
        return Response({"success": True, "student": serializer.data})
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found."}, status=404)


@api_view(["GET"])
def search_book_for_issue(request, isbn):
    try:
        # ISBN ke base par book dhundhna
        book = Book.objects.get(isbn=isbn)
        if book.quentity <= 0:
            return Response({"success": False, "message": "Book is currently out of stock."}, status=400)
        
        serializer = BookSerializer(book)
        return Response({"success": True, "book": serializer.data})
    except Book.DoesNotExist:
        return Response({"success": False, "message": "Book not found."}, status=404)


@api_view(["POST"])
def issue_book_api(request):
    student_pk = request.data.get("student_id") # Table ka primary key ID (1, 2, 3...)
    book_pk = request.data.get("book_id")       # Table ka primary key ID
    remark = request.data.get("remark", "")

    try:
        student = Student.objects.get(id=student_pk)
        book = Book.objects.get(id=book_pk)

        # Check karo ki quantity 0 se zyada hai
        if book.quentity > 0:
            # IssuedBook table me entry banana[cite: 1]
            IssuedBook.objects.create(
                book=book,
                student=student,
                remark=remark
            )
            # Book table me se quantity -1 kar dena[cite: 1]
            book.quentity -= 1
            book.save()
            
            return Response({
                "success": True, 
                "message": "Book issued successfully!"
            })
        else:
            return Response({"success": False, "message": "Book out of stock."}, status=400)

    except (Student.DoesNotExist, Book.DoesNotExist):
        return Response({"success": False, "message": "Invalid Student or Book."}, status=400)


# views.py ke niche add karein
@api_view(["GET"])
def get_all_issued_books(request):
    # Saari issued books fetch karna, latest sabse upar (order_by "-id")
    issued_books = IssuedBook.objects.all().order_by("-id")
    serializer = IssuedBookSerializer(issued_books, many=True)
    return Response(serializer.data)


# views.py ke niche add karein

@api_view(["GET"])
def get_issued_book_details(request, id):
    try:
        # IssuedBook table se record nikalo
        issued_book = IssuedBook.objects.get(id=id)
        
        # Hum direct data dictionary bana rahe hain taaki frontend ko easy rahe
        data = {
            "id": issued_book.id,
            "student_id": issued_book.student.student_id,
            "student_name": issued_book.student.full_name,
            "book_name": issued_book.book.title,
            "isbn": issued_book.book.isbn,
            "cover_image": issued_book.book.cover_image.url if issued_book.book.cover_image else None,
            "issued_at": issued_book.issued_at,
            "returned_at": issued_book.retuened_at, # using your exact model spelling
            "is_returned": issued_book.is_returned,
            "fine": issued_book.fine,
        }
        return Response({"success": True, "data": data})
    except IssuedBook.DoesNotExist:
        return Response({"success": False, "message": "Record not found"}, status=404)


@api_view(["POST"])
def return_issued_book(request, id):
    try:
        issued_book = IssuedBook.objects.get(id=id)
        
        if issued_book.is_returned:
            return Response({"success": False, "message": "Book is already returned."}, status=400)

        # Frontend se fine amount lena (default 0)
        fine_amount = request.data.get("fine", 0)

        # 1. IssuedBook record update karna[cite: 1]
        issued_book.is_returned = True
        issued_book.retuened_at = timezone.now()
        issued_book.fine = fine_amount
        issued_book.save()

        # 2. Book ki quantity wapas badhana[cite: 1]
        book = issued_book.book
        book.quentity += 1 
        book.save()

        return Response({"success": True, "message": "Book returned successfully!"})
        
    except IssuedBook.DoesNotExist:
        return Response({"success": False, "message": "Record not found"}, status=404)



# views.py ke niche add karein

@api_view(["GET"])
def get_student_history(request, id):
    try:
        # Pehle student ko dhundho
        student = Student.objects.get(id=id)
        
        # Fir us student ki saari issued books nikal lo, latest pehle (order_by "-id")
        history = IssuedBook.objects.filter(student=student).order_by("-id")
        
        # Purana IssuedBookSerializer use karke data format kar lo
        serializer = IssuedBookSerializer(history, many=True)
        
        # Student ki basic info alag se bhej do header me dikhane ke liye
        student_data = {
            "student_id": student.student_id,
            "full_name": student.full_name,
            "email": student.email,
            "mobile": student.mobile
        }
        
        return Response({
            "success": True, 
            "student": student_data,
            "history": serializer.data
        })
        
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)


# views.py ke niche add karein

@api_view(["GET"])
def admin_dashboard_stats(request):
    # 1. Students Stats
    total_students = Student.objects.count()
    active_students = Student.objects.filter(is_active=True).count()
    blocked_students = Student.objects.filter(is_active=False).count()

    # 2. Books Stats
    total_books = Book.objects.count()
    available_books = Book.objects.filter(quentity__gt=0).count()
    out_of_stock_books = Book.objects.filter(quentity__lte=0).count()

    # 3. Issued Records Stats
    total_issued = IssuedBook.objects.count()
    currently_issued = IssuedBook.objects.filter(is_returned=False).count()
    returned_issued = IssuedBook.objects.filter(is_returned=True).count()

    # 4. Categories & Authors Stats
    total_categories = Category.objects.count()
    total_authors = Author.objects.count()

    return Response({
        "success": True,
        "stats": {
            "students": {
                "total": total_students, 
                "active": active_students, 
                "blocked": blocked_students
            },
            "books": {
                "total": total_books, 
                "available": available_books, 
                "out_of_stock": out_of_stock_books
            },
            "issued": {
                "total": total_issued, 
                "currently": currently_issued, 
                "returned": returned_issued
            },
            "categories": total_categories,
            "authors": total_authors
        }
    })


@api_view(["GET"])
def get_my_issued_books(request, student_id):
    try:
        # Custom student_id se student dhundhna
        student = Student.objects.get(student_id=student_id)
        
        # Uski saari history nikalna, latest pehle
        my_books = IssuedBook.objects.filter(student=student).order_by("-id")
        
        # Data format karna (wahi purana serializer use karke)
        serializer = IssuedBookSerializer(my_books, many=True)
        
        return Response({
            "success": True, 
            "data": serializer.data
        })
    except Student.DoesNotExist:
        return Response({"success": False, "message": "Student not found"}, status=404)
    