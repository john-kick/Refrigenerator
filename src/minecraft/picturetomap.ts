import * as nbt from "prismarine-nbt";
import { writeFile, writeFileSync, readdirSync, fstat } from "node:fs";
import sharp from "sharp";
import { join } from "node:path";
import { minecraftServerPath } from "../../config.json";
import { GuildTemplate } from 'discord.js';

// createMapFromPicture('/home/andre/GrilledCheeseObamaSandwichToBeSplit.png', true, 5, 3);
// buildCommand([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

export async function createMapFromPicture(imagePath: string, divide?: boolean, width?: number, height?: number) {
  width = width || 1;
  height = height || 1;

  const image = sharp(imagePath);

  if (divide) {
    const sections = await splitImage(resizeImage(image, width, height), width, height);
    const indices = await Promise.all(sections.map(async (section) => {
      return await bufferToNBT(section);
    }));
    return buildCommand(indices);
  } else {
    const index = await bufferToNBT(resizeImage(image, 1, 1));
    return "/give @p filled_map{map:" + index + "}";
  }
}

async function bufferToNBT(image: sharp.Sharp) {
  const data: nbt.NBT = {
    name: "data",
    type: nbt.TagType.Compound,
    value: {
      data: {
        type: nbt.TagType.Compound,
        value: {
          banners: {
            type: nbt.TagType.List,
            value: {
              type: nbt.TagType.Compound,
              value: []
            }
          },
          frames: {
            type: nbt.TagType.List,
            value: {
              type: nbt.TagType.Compound,
              value: []
            }
          },
          dimension: {
            type: nbt.TagType.String,
            value: "minecraft:overworld"
          },
          locked: {
            type: nbt.TagType.Byte,
            value: 1
          },
          scale: {
            type: nbt.TagType.Byte,
            value: 0
          },
          trackingPosition: {
            type: nbt.TagType.Byte,
            value: 0
          },
          unlimitedTracking: {
            type: nbt.TagType.Byte,
            value: 0
          },
          xCenter: {
            type: nbt.TagType.Int,
            value: 0
          },
          zCenter: {
            type: nbt.TagType.Int,
            value: 0
          },
          colors: {
            type: nbt.TagType.ByteArray,
            value: await quantize(image)
          }
        }
      },
      DataVersion: {
        type: nbt.TagType.Int,
        value: 3218
      }
    }
  };

  const [index, path] = getFileName();
  try {
    writeFileSync(path, nbt.writeUncompressed(data));
  } catch (error) {
    console.error("Could not write data into .dat file");
    throw error;
  }
  return index;
}

function resizeImage(image: sharp.Sharp, width: number, height: number) {
  const targetWidth = width * 128;
  const targetHeight = height * 128;

  return image.resize({ width: targetWidth, height: targetHeight, fit: 'fill' });
}

async function splitImage(image: sharp.Sharp, width: number, height: number) {
  const imgBuffer = await image.raw().toBuffer();
  if (imgBuffer.length % 128 * 128 !== 0) {
    throw new Error('Invalid image dimensions');
  }

  const sections = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const section = await image.clone().extract({
        left: col * 128,
        top: row * 128,
        width: 128,
        height: 128
      });
      sections.push(section);
    }
  }

  return sections;
}

function saveImage(imageBuffer: Buffer, path: string) {
  writeFileSync(path, imageBuffer);
}

async function quantize(image: sharp.Sharp) {
  const data = await image.raw().toBuffer();
  const palette = getColorPalette();
  const pixels = [];
  for (let i = 0; i < data.length; i += 3) {
    pixels[i / 3] = [data[i], data[i + 1], data[i + 2]];
  }
  const indices: number[] = [];
  pixels.forEach((pixel) => {
    let closest = closestColor(pixel, palette);
    indices.push(closest.index)
  });
  return indices;
}

function closestColor(pixel: number[], palette: number[][]) {
  let closestColor;
  let closestIndex = Number.MAX_SAFE_INTEGER;
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (var i = 0; i < palette.length; i++) {
    var paletteColor = palette[i];
    var distance = Math.sqrt(
      Math.pow(pixel[0] - paletteColor[0], 2) +
      Math.pow(pixel[1] - paletteColor[1], 2) +
      Math.pow(pixel[2] - paletteColor[2], 2)
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i >= 128 ? i - 256 : i;
      closestColor = paletteColor;
    }
  }

  return { index: closestIndex, color: closestColor };
}

function getFileName(): [number, string] {
  const dirPath = minecraftServerPath + 'world/data/'; // replace with the actual directory path

  // find existing files with the format "map_<#>.dat"
  const existingFiles = readdirSync(dirPath).filter(file => /^map_\d+\.dat$/.test(file));

  // extract the <#> part from each file name
  const usedNumbers: number[] = [];
  existingFiles.forEach((file) => {
    const matchResult = file.match(/^map_(\d+)\.dat$/);
    if (matchResult) {
      const usedNumber = parseInt(matchResult[1]);
      usedNumbers.push(usedNumber);
    }
  });

  // find the lowest available <#> part
  let nextNumber = 0;
  while (usedNumbers.includes(nextNumber)) {
    nextNumber++;
  }

  // generate the new file name with the unique <#> part
  const newFileName = `map_${nextNumber}.dat`;
  return [nextNumber, join(dirPath, newFileName)];
}

function buildCommand(indices: number[]) {
  const len = indices.length;
  let command = "/summon armor_stand ~ ~" + len + " ~ {Health:0,Passengers:[{" + addCommand(indices, len) + "}]}";
  return command;
}

function addCommand(indices: number[], originalLen: number) {
  let command = "id:\"armor_stand\","
    + "Health:0,"
    + "Passengers:[{"
    + "id:\"falling_block\","
    + "Time:1,"
    + "BlockState:{"
    + "Name:\"command_block\""
    + "},TileEntityData:{"
    + "auto:1,"
    + "Command:\"/give @p filled_map{map:" + indices[0] + "}\""
    + "}"
    + ",Passengers:[{"
  if (indices.length > 1) {
    command += addCommand(indices.splice(1), originalLen)
  } else {
    command += "id:\"armor_stand\","
      + "Health:0,"
      + "Passengers:[{"
      + "id:\"falling_block\","
      + "Time:1,"
      + "BlockState:{"
      + "Name:\"command_block\""
      + "},"
      + "TileEntityData:{"
      + "auto:1,"
      + "Command:\"fill ~ ~-" + originalLen + " ~ ~ ~ ~ air\""
      + "}"
      + "}]"
  }
  command += "}]}]";

  return command;
}

function getColorPalette() {
  return [
    [-255, -255, -255],
    [-255, -255, -255],
    [-255, -255, -255],
    [-255, -255, -255],
    [88, 124, 39],
    [108, 151, 47],
    [125, 176, 55],
    [66, 93, 29],
    [172, 162, 114],
    [210, 199, 138],
    [244, 230, 161],
    [128, 122, 85],
    [138, 138, 138],
    [169, 169, 169],
    [197, 197, 197],
    [104, 104, 104],
    [178, 0, 0],
    [217, 0, 0],
    [252, 0, 0],
    [133, 0, 0],
    [111, 111, 178],
    [136, 136, 217],
    [158, 158, 252],
    [83, 83, 133],
    [116, 116, 116],
    [142, 142, 142],
    [165, 165, 165],
    [87, 87, 87],
    [0, 86, 0],
    [0, 105, 0],
    [0, 123, 0],
    [0, 64, 0],
    [178, 178, 178],
    [217, 217, 217],
    [252, 252, 252],
    [133, 133, 133],
    [114, 117, 127],
    [139, 142, 156],
    [162, 166, 182],
    [85, 87, 96],
    [105, 75, 53],
    [128, 93, 65],
    [149, 108, 76],
    [78, 56, 39],
    [78, 78, 78],
    [95, 95, 95],
    [111, 111, 111],
    [58, 58, 58],
    [44, 44, 178],
    [54, 54, 217],
    [63, 63, 252],
    [33, 33, 133],
    [99, 83, 49],
    [122, 101, 61],
    [141, 118, 71],
    [74, 62, 38],
    [178, 175, 170],
    [217, 214, 208],
    [252, 249, 242],
    [133, 131, 127],
    [150, 88, 36],
    [184, 108, 43],
    [213, 125, 50],
    [113, 66, 27],
    [124, 52, 150],
    [151, 64, 184],
    [176, 75, 213],
    [93, 39, 113],
    [71, 107, 150],
    [87, 130, 184],
    [101, 151, 213],
    [53, 80, 113],
    [159, 159, 36],
    [195, 195, 43],
    [226, 226, 50],
    [120, 120, 27],
    [88, 142, 17],
    [108, 174, 21],
    [125, 202, 25],
    [66, 107, 13],
    [168, 88, 115],
    [206, 108, 140],
    [239, 125, 163],
    [126, 66, 86],
    [52, 52, 52],
    [64, 64, 64],
    [75, 75, 75],
    [39, 39, 39],
    [107, 107, 107],
    [130, 130, 130],
    [151, 151, 151],
    [80, 80, 80],
    [52, 88, 107],
    [64, 108, 130],
    [75, 125, 151],
    [39, 66, 80],
    [88, 43, 124],
    [108, 53, 151],
    [125, 62, 176],
    [66, 33, 93],
    [36, 52, 124],
    [43, 64, 151],
    [50, 75, 176],
    [27, 39, 93],
    [71, 52, 36],
    [87, 64, 43],
    [101, 75, 50],
    [53, 39, 27],
    [71, 88, 36],
    [87, 108, 43],
    [101, 125, 50],
    [53, 66, 27],
    [107, 36, 36],
    [130, 43, 43],
    [151, 50, 50],
    [80, 27, 27],
    [17, 17, 17],
    [21, 21, 21],
    [25, 25, 25],
    [13, 13, 13],
    [174, 166, 53],
    [212, 203, 65],
    [247, 235, 76],
    [130, 125, 39],
    [63, 152, 148],
    [78, 186, 181],
    [91, 216, 210],
    [47, 114, 111],
    [51, 89, 178],
    [62, 109, 217],
    [73, 129, 252],
    [39, 66, 133],
    [0, 151, 39],
    [0, 185, 49],
    [0, 214, 57],
    [0, 113, 30],
    [90, 59, 34],
    [110, 73, 41],
    [127, 85, 48],
    [67, 44, 25],
    [78, 1, 0],
    [95, 1, 0],
    [111, 2, 0],
    [58, 1, 0],
    [148, 124, 114],
    [180, 153, 139],
    [209, 177, 161],
    [111, 94, 85],
    [112, 58, 25],
    [137, 71, 31],
    [159, 82, 36],
    [84, 43, 19],
    [105, 61, 76],
    [129, 75, 93],
    [149, 87, 108],
    [79, 46, 57],
    [79, 76, 97],
    [97, 93, 119],
    [112, 108, 138],
    [59, 57, 73],
    [131, 94, 25],
    [160, 115, 31],
    [186, 133, 36],
    [98, 70, 19],
    [73, 83, 37],
    [89, 101, 46],
    [103, 117, 53],
    [55, 62, 28],
    [113, 54, 55],
    [138, 66, 67],
    [160, 77, 78],
    [85, 41, 41],
    [40, 29, 25],
    [49, 35, 30],
    [57, 41, 35],
    [30, 22, 19],
    [95, 76, 69],
    [116, 92, 85],
    [135, 107, 98],
    [71, 57, 52],
    [61, 65, 65],
    [75, 79, 79],
    [87, 92, 92],
    [46, 49, 49],
    [86, 52, 62],
    [105, 63, 76],
    [122, 73, 88],
    [65, 39, 47],
    [54, 44, 65],
    [66, 53, 79],
    [76, 62, 92],
    [40, 33, 49],
    [54, 35, 25],
    [66, 43, 30],
    [76, 50, 35],
    [40, 26, 19],
    [54, 58, 30],
    [66, 71, 36],
    [76, 82, 42],
    [40, 43, 22],
    [100, 42, 32],
    [123, 52, 40],
    [142, 60, 46],
    [75, 32, 24],
    [26, 16, 11],
    [32, 19, 14],
    [37, 22, 16],
    [20, 12, 8]
  ]
};
