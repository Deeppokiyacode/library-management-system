from django.urls import path
from .views import *

urlpatterns = [
    path("admin-login/", admin_login_api),

    path("categories/", get_categories),
    path("categories/add/", add_category),
    path("categories/<int:id>/", update_category),
    path("categories/<int:id>/delete/", delete_category),


    path("author/", get_author),
    path("author/add/", add_author),
    path("author/<int:id>/", update_author),
    path("author/<int:id>/delete/", delete_author),


    path("books/add/", add_book),
    path("books/", get_books),
    path("books/<int:id>/update/", update_book),
    path("books/<int:id>/delete/", delete_book),

    
    path("admin/change-password/", change_admin_password),
    # urlpatterns me add karein
    path("students/", get_all_students),
    path("students/<int:id>/toggle-status/", toggle_student_status),

    # User section
    path("student/signup/", student_signup),
    path("student/login/", student_login),
    # urlpatterns me add karein
    path("student/dashboard-stats/<str:student_id>/", student_dashboard_stats),
    # urlpatterns me add karein
    path("student/profile/<str:student_id>/", get_student_profile),
    path("student/profile/<str:student_id>/update/", update_student_profile),
# urlpatterns me add karein
    path("student/change-password/", student_change_password),

    # urlpatterns me add karein
    path("issue-book/search-student/<str:student_id>/", search_student_for_issue),
    path("issue-book/search-book/<str:isbn>/", search_book_for_issue),
    path("issue-book/submit/", issue_book_api),

    # urlpatterns me add karein
    path("issued-books/", get_all_issued_books),

    # urlpatterns me add karein
    path("issued-book/<int:id>/", get_issued_book_details),
    path("issued-book/<int:id>/return/", return_issued_book),
    # urlpatterns me add karein
    path("students/<int:id>/history/", get_student_history),
    path("admin/dashboard-stats/", admin_dashboard_stats),
    path("user/my-issued-books/<str:student_id>/", get_my_issued_books),
   


]