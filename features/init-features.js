const path = require('path')
const fs = require('fs')

module.exports = (client, cache) => {
    const readFeatures = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))

        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))

            if (stat.isDirectory()) {
                readFeatures(path.join(dir, file))
            } else if (file !== `init-features.js`) {
                const feature = require(path.join(__dirname, dir, file))
                console.log(`Enabling feature "${file}"`)
                feature(client, cache)
            }
        }
    }

    readFeatures(`.`)
}