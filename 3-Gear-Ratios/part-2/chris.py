#  Run with Python3! : python3 chris.py

from typing import Tuple
file = open("./input.txt", "r").read().split()
res = 0
digitVisited = set()
gears = {}


def validateGear(index: Tuple[int, int], num: str, isGear: bool, gearIndex=(-1, -1)) -> Tuple[str, bool, Tuple[int, int]]:
    i, j = index
    # base case. same as part 1
    if j not in range(len(file[i])) or not file[i][j].isdigit():
        return (num, isGear, gearIndex)
    num += file[i][j]
    digitVisited.add((i, j))

    if not isGear:
        directions = [[0, 1], [0, -1], [1, 0], [1, 1],
                      [1, -1], [-1, 0], [-1, -1], [-1, 1]]
        for dx, dy in directions:
            x, y = i + dx, j + dy

            # if char * is found then set isGear bool to true as well as saving the gearIndex as a tuple
            if x in range(len(file)) and y in range(len(file[0])) and file[x][y] == "*":
                isGear = True
                gearIndex = (x, y)
                break

    # goes to next digit while storing isGear bool and gearIndex values if found
    return validateGear((i, j + 1), num, isGear, gearIndex)


# iterate through the file. same as part 1.
for i in range(len(file)):
    for j in range(len(file[0])):
        if file[i][j] and file[i][j].isdigit() and (i, j) not in digitVisited:

            num, isGear, gearIndex = validateGear((i, j), '', False)

            # if the found number is part of a gear then add to gears dict. The key is the index of the * as a tuple and the values are an array of the numbers
            if isGear:
                if gearIndex not in gears:
                    gears[gearIndex] = []
                gears[gearIndex].append(int(num))

# iterate through gears dict. if there are two numbers for an index then multiple them together and add the product to res
for gearIndex in gears:
    if len(gears[gearIndex]) == 2:
        res += gears[gearIndex][0] * gears[gearIndex][1]


print(res)
