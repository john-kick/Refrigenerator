#include <iostream>
#include <fstream>
#include <string>

#include <arpa/inet.h>

struct PNGHeader {
    char signature[8];
    uint32_t width;
    uint32_t height;
};

int main() {
    // Replace "input.png" with the path to your PNG file
    const char* filename = "file.png";

    // Open the PNG file in binary mode
    std::ifstream file(filename, std::ios::binary);

    if (!file.is_open()) {
        std::cerr << "Error opening file: " << filename << std::endl;
        return 1;
    }

    // Read the PNG header
    PNGHeader header;
    file.read(reinterpret_cast<char*>(&header), sizeof(PNGHeader));

    // Check if the file is a PNG file by verifying the PNG signature
    std::string pngSignature("\x89\x50\x4E\x47\x0D\x0A\x1A\x0A");
    if (pngSignature.compare(0, 8, header.signature, 8) != 0) {
        std::cerr << "Not a valid PNG file: " << filename << std::endl;
        file.close();
        return 1;
    }

    // Convert endianness of width and height if necessary
    uint32_t width = ntohl(header.width);
    uint32_t height = ntohl(header.height);

    // Output dimensions
    std::cout << "Dimensions of " << filename << ": " << width << "x" << height << std::endl;

    // Close the file
    file.close();

    return 0;
}
