import fs from "fs"
import res from "../card-fronts.json"

type CardImagesType = Record<
  string,
  {
    imgData: string
    uuid: string
  }
>

generateCardImages()

// Takes a list of cards and generates the AR card back images for each card
function generateCardImages(): void {
  // Ensure the directory exists
  const directory = "card-imgs"

  Object.entries(res)
    // .slice(0, 100)
    .forEach(([name, data]) => {
      const folder = "card_fronts"
      // split at the first underscore followed by a number found
      // const folder = name
      //     .split(/_[0-9]/)[0]
      //     .replace(/\s+/g, "_")
      //     .replace(/_+/g, "_")

      // create the directory if it doesn't exist
      if (!fs.existsSync(`bin/ignore/${directory}/${folder}`)) {
        fs.mkdirSync(`bin/ignore/${directory}/${folder}`, {
          recursive: true,
        })
      }

      const fileName = `bin/ignore/${directory}/${folder}/${name
        .trim()
        .replace(/\s+/g, "_")}.png`
        // replace any repeating underscores
        .replace(/_+/g, "_")

      const dataUri = data.imgData

      const matches = dataUri.match(/^data:image\/png;base64,(.+)$/)

      if (!matches) {
        console.log("No match!")
        return
      }

      const base64Data = matches[1]
      const buffer = Buffer.from(base64Data, "base64")

      fs.writeFileSync(fileName, buffer)
    })
}
