#  Run with Python3! : python3 chris.py

from typing import Tuple
file = open("./input.txt", "r").read().split()
symbols = set(["*", "%", "#", "=", "@", "$", "/", "-", "+", "&"])
res = 0
digitVisited = set()


def validatePart(index: Tuple[int, int], num: str, isPart: bool) -> Tuple[str, bool]:
    i, j = index
    # base case. if char is out of bounds or if reached end of number then return
    if j not in range(len(file[i])) or not file[i][j].isdigit():
        return (num, isPart)
    num += file[i][j]
    digitVisited.add((i, j))

    # if symbol not found yet then scan the neighbors
    if not isPart:
        directions = [[0, 1], [0, -1], [1, 0], [1, 1],
                      [1, -1], [-1, 0], [-1, -1], [-1, 1]]
        for dx, dy in directions:
            x, y = i + dx, j + dy

            # if symbol found then set isPart true and break out of loop
            if x in range(len(file)) and y in range(len(file[0])) and file[x][y] in symbols:
                isPart = True
                break
    # goes to the next digit of the number to scan for symbols
    return validatePart((i, j + 1), num, isPart)


# iterates through each line (i) and each character for every line (j)
for i in range(len(file)):
    for j in range(len(file[0])):
        if file[i][j] and file[i][j].isdigit() and (i, j) not in digitVisited:
            # build number and find any symbol neighbors. if isPart is true then add num to res
            num, isPart = validatePart((i, j), '', False)
            if isPart:
                res += int(num)
print(res)
