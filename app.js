const axios = require('axios');
var execSync = require('child_process').execSync;
var token = 'd709323d38dd41e64561276b7842e7f056067e07';


axios.get('https://api.github.com/users/VikasSuresh/repos',{
    headers: {
        authorization: `token ${token}` 
      }
}).then(({data})=>{
    var dir=data[3].name
    try{
        try{
            execSync(`mkdir ${dir}`)
            execSync(`git clone ${data[3].ssh_url}`)
        }catch(err){
            execSync('git pull',{cwd:`${dir}`})
        }finally{
            try{
                var y=execSync(`find ${dir} -name package.json`).toString().split('\n')
                if (y.length===1 && y[0]===''){
                    console.log('Package.Json not Found')
                }else{
                    y.splice(y.indexOf(''),1);
                    y.forEach(element => {
                        execSync('ncu -u',{cwd:`./${element.slice(0,element.indexOf('package.json'))}`})
                    })
                    if(!execSync('git status',{cwd:`./${dir}`}).toString().includes('nothing to commit, working tree clean')){
                        execSync('git add -A',{cwd:`./${dir}`})
                        execSync('git commit -m "commited using bash"',{cwd:`./${dir}`})
                        execSync('git push',{cwd:`./${dir}`})
                    }else{
                        console.log('no files updated')
                    }
                };
            }catch(e){
                console.log(e.output[2].toString())
                process.exit();
            }
        }
    }
    catch(error){
        console.log(error.output[2].toString(),'overall')
        process.exit();
    }
})