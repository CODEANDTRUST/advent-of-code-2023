#  Run with Python3! : python3 chris.py

gameLimits = {"red": 12, "green": 13, "blue": 14}
games = open("./input.txt", "r").readlines()
res = 0

# breaks the lines into parts based off of different delimiters present in the string
for game in games:
    gameDesc, demos = game.split(":")
    gameId = gameDesc.split(" ")[1]
    breakLoop = False

    # demo is each time the elf pulls cubes out of the bag in a game.
    for demo in demos.split(";"):
        for cubes in demo.replace('\n', '').split(","):
            quant, color = cubes[1:].split(" ")

            # condition for a game being impossible
            # If true then break out of loops and go to next game
            # the breakLoop var is used to break out of outer loops
            if int(quant) > gameLimits[color]:
                breakLoop = True
                break
        if breakLoop:
            break
    # if the loops havent been stopped then add the game ID to the result.
    if not breakLoop:
        res += int(gameId)

print(res)
