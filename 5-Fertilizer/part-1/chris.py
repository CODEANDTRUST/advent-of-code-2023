file = open("./input.txt", "r").readlines()

seeds = file[0].split(":")[1].strip().split(" ")
maps = []
res = float("inf")

i = 2
while i < len(file):
    while i < len(file) and len(file[i].strip().split(" ")) > 1:
        maps.append(file[i].strip().split(" "))
        i += 1
    i += 1

for seed in seeds:
    mappedSeed = int(seed)
    j = 0
    while j < len(maps):
        while j < len(maps) and len(maps[j]) == 3:
            destination, source, range = list(map(lambda x: int(x), maps[j]))
            if (source + range) > mappedSeed >= source:
                mappedSeed = (destination - source) + mappedSeed
                while j < len(maps) and len(maps[j]) == 3:
                    j += 1
            else:
                j += 1
        j += 1
    res = min(res, mappedSeed)
print(res, "res")
