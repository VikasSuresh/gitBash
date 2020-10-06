require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const execSync = require('child_process').execSync;

const gitRead = async ()=>{
   try {
    const { data } = await axios.get('https://api.github.com/users/VikasSuresh/repos',{
        headers: {
            authorization: `token ${process.env.token}` 
          }
    })
    let gitFiles = data.map(d=>({
        name:d.name,
        ssh_url:d.ssh_url
    }));
    await Promise.all(gitFiles.map(async(f)=>{
        try {
            if(!fs.existsSync(f.name)){
                execSync(`mkdir ${f.name}`)
                execSync(`git clone ${f.ssh_url}`)
            }else{
                execSync('git pull',{cwd:`${f.name}`, stdio:"inherit"})
            }
            let filesArray = execSync(`find ${f.name} -name package.json -not -path "*/node_modules/*"`).toString().split('\n')
            filesArray = filesArray.filter((fA)=>!(fA===''));
            if(filesArray.length===0){
                console.log('package.json not Found')
            }
            await Promise.all(filesArray.map(element => {
                console.log(`${element.slice(0,element.indexOf('package.json'))} - Updating Version in json file`)
                execSync('ncu -u',{cwd: `./${element.slice(0,element.indexOf('package.json'))}`})
                console.log("Installing packages and Updating lock-json file")
                execSync('npm i',{cwd: `./${element.slice(0,element.indexOf('package.json'))}`})
            }))
            if(!execSync('git status',{ cwd: `./${f.name}`}).toString().includes('nothing to commit, working tree clean')){
                execSync('git add -A',{ cwd: `./${f.name}`} )
                execSync('git commit -m "Packages Updated "',{ cwd:`./${f.name}`})
                execSync('git push',{cwd:`./${f.name}`})
            }else{
                console.log('No Files Updated')
            }
        } catch (error) {
            throw new Error(error);
        }
    }))
   } catch (error) {
       throw new Error(error);
   }
}

gitRead()