from django.http import HttpResponse


def home(request):
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Naglasupan</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fafafa;
        }
        img {
            max-width: 200px;
            height: auto;
        }
    </style>
</head>
<body>
    <img src="/static/naglasupan.svg" alt="Naglasupan">
</body>
</html>"""
    return HttpResponse(html)
