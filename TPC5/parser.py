import json

with open("arq-son-EVO.json") as f:
    file = json.load(f)


for index, value in enumerate(file["musicas"]):
    print(value)
    value["id"] = index+1

with open("arq-son-parsed.json", 'w', encoding="utf-8") as f:
    json.dump(file, f)
