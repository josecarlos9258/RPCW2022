import json


data = json.load(open("cinemaATP.json", encoding="utf-8"))
data.sort(key=lambda x: x["title"])


# Individual page of each film
movieId = 1
c = 1
for elem in data:
    file = open("./data/movieId" + str(movieId) +
                ".html", "w", encoding="utf-8")
    movieId += 1

    header = f'''<!DOCTYPE html>\n
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">
    </head> '''

    footer = '''
        <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
        </div>
        </body>
    </html>'''

    singleatrib = f''' 
    <body>
        <div class="w3-container w3-teal w3-margin w3-dark-grey">
        <h1> <b>Movie:</b> {elem['title']}</h1>
        <p> <b>Year:</b> {elem['year']} </p>
        <p> <b>Cast:</b> </p>\n'''

    content = header + singleatrib

    content += f'''
    <ul style="list-style-type:circle">'''

    for cas in elem['cast']:
        content += f'''<li>{cas}</li>\n'''

    content += f'''
        </ul>'''

    content += f'''
    <b>Genres:</b>'''
    for gen in elem['genres']:
        content += f'''<li>{gen}</li>\n'''

    content += f'''
        <b><a href=./index.html> Previous page </a></b>
    </div>'''

    content += footer
    c += 1

    file.write(content)


# Movies Index page
f = open("./data/index.html", "w", encoding="utf-8")
i = 1

header = '''<!DOCTYPE html>\n
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">
</head>'''

footer = '''
        <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
        </div>
        </body>
</html>'''

content = header

content += ''' 
<body>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> RPCW 2021/2022 TPC2 - Movies and Actors </p>
    </div> '''

content += '''
<div class="w3-container w3-margin-left">
'''
for elem in data:
    content += f'''<p><a href=./movieId/{i}> {elem['title']} </a></p>\n'''
    i += 1

content += '''
    </div>'''

content += footer
f.write(content)

# Individual page of each Actor
dic = {}

for obj in data:
    for at in obj['cast']:
        dic.setdefault(at, []).append(obj['title'])

sorted_items = sorted(dic.items())

i = 1
for ator in dic:
    f = open("./data/actorId" + str(i) + ".html", "w", encoding="utf-8")
    i += 1

    header = '''<!DOCTYPE html>\n
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">
</head>'''

    footer = '''
        <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
        </div>
        </body>
</html>'''
    content = header

    content += '''
    <body>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">'''
    content += f'''<h1><b>Actor: {ator}</b></h1>'''
    content += '''<p><b>Films in which he participates:</b></p>'''
    content += f''' <ul style="list-style-type:circle">'''

    for cas in dic[ator]:
        content += f'''<li>{cas}</li>\n'''
    content += '''
        </ul>'''

    content += f'''
        <b><a href=./index.html> Previous page </a></b>
    </div>'''

    content += footer
    f.write(content)

# Movies Actors page
t = open("./data/actorsindex.html", "w", encoding="utf-8")
i = 1
header = '''<!DOCTYPE html>\n
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Allerta+Stencil">
</head>'''

footer = '''
</div>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">
        <p class="w3-small"> José Carlos Magalhães | RPCW 2021/2022 </p>
    </div>
    </body>
</html>'''

content = header

content += '''
<body>
    <div class="w3-container w3-teal w3-margin w3-dark-grey">
            <p class="w3-small"> RPCW 2021/2022 TPC2 - Movies and Actors </p>
    </div> '''

content += '''<div class="w3-container w3-margin-left">'''
for ator in dic:
    content += f'''<p><a href=./actorId{i}\n> {ator} </a></p>'''
    i += 1

content += footer
t.write(content)
