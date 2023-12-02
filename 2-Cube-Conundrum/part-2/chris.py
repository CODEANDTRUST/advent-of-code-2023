#  Run with Python3! : python3 chris.py

games = open("./input.txt", "r").readlines()
res = 0

# same logic with delimiters as part1 but instead of checking if a threshold has been reached
# this finds the maximum for every color in a game and multiples them together and adds the product to res
for game in games:
    maxValues = {"red": 0, "green": 0, "blue": 0}

    for demo in game.split(":")[1].split(";"):
        for cubes in demo.replace('\n', '').split(","):
            quant, color = cubes[1:].split(" ")
            maxValues[color] = max(maxValues[color], int(quant))

    # iterate through maxValues object and add product to res
    product = 1
    for value in maxValues.values():
        product *= value
    res += product

print(res)
