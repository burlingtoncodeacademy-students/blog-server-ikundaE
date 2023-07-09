//declare file system
const fs = require ("fs")

//function to write data in the db
function save (data, path){
    
    // Write the data to the file
    fs.writeFileSync(path, JSON.stringify(data), err =>{
        if (err) console.log(err)
    } )
}

//function to get data from db
function read(path){
    const file = fs.readFileSync(path)
    return !file.length? [] :JSON.parse(file)
}

module.exports = {save, read}