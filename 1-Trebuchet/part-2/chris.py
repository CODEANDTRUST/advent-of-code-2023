#  Run with Python3! : python3 chris.py

res = 0
file = open("../exampleInput2.txt", "r").read().split()
charToDigit = {"one": "1", "two": "2", "three": "3", "four": "4",
               "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9"}

for line in file:
    # loop through all the char nums in charToDigit for every line
    # l is lower index of each num
    # r iterates through the line and will be the upper index of each num
    # if num exists in the line string then replace the middle char of num with its digit
    # by replacing the middle char this hopefully won't disrupt other nums that the substring is a part of
    # example: zoneight234 -> zo1eight234 -> zo1ei8ht234
    for num in charToDigit.keys():
        l = 0
        for r in range(len(num) - 1, len(line)):
            if line[l:r + 1] == num:
                mid = (r + l) // 2
                line = line[:mid] + charToDigit[num] + line[mid + 1:]
            l += 1

    # below code is the same as part1
    first, firstNum, lastNum = False, '', ''

    for char in line:
        if not first and char.isdigit():
            firstNum = char
            first = True
        elif char.isdigit():
            lastNum = char

    if not lastNum:
        res += int(firstNum + firstNum)
    else:
        res += int(firstNum + lastNum)

print(res)
