#  Run with Python3! : python3 chris.py

res = 0
file = open("../exampleInput1.txt", "r").read().split()

for line in file:
    first, firstNum, lastNum = False, '', ''

    # loop through each character of the line
    for char in line:
        # set first bool to true after encountering first digit
        if not first and char.isdigit():
            firstNum = char
            first = True
        # set lastNum to char whenever char is a digit
        elif char.isdigit():
            lastNum = char

    # if a line only has one digit then add that digit together
    if not lastNum:
        res += int(firstNum + firstNum)
    else:
        res += int(firstNum + lastNum)

print(res)
