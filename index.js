const axios = require('axios');
const git = require('isomorphic-git');
const fs = require('fs');
git.plugins.set('fs', fs)
var find=require('find');
var ncu=require('npm-check-updates');

var token = 'd709323d38dd41e64561276b7842e7f056067e07';
axios.get('https://api.github.com/users/VikasSuresh/repos',{
    headers: {
        authorization: `token ${token}` 
      }
})
    .then(({data})=>{
        data.forEach(repo => {        
            var dir =repo.name;
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir)
                git.clone({
                    dir,
                    corsProxy: 'https://cors.isomorphic-git.org',
                    url: repo.clone_url,
                    ref: 'master',
                    singleBranch: true,
                    depth: 10
                }).then(()=>{
                    find.file('package.json',`${__dirname}/${dir}`,(file)=>{
                        if(file.length!==0){
                            file.forEach(path => {
                                gitFunction(dir,path);
                            });
                        }else{
                            console.log('package.json not found')
                        }
                    })
                }).catch(()=>{
                    console.log('Error in Cloning');
                })
            }else{
                git.pull({
                    dir,
                    ref:'master',
                    singleBranch:true
                }).then(()=>{
                    find.file('package.json',`${__dirname}/${dir}`,(file)=>{
                        if(file.length!==0){
                            file.forEach(path => {
                                gitFunction(dir,path);
                            });
                        }else{
                            console.log('package.json not found')
                        }
                    })
                }).catch((err)=>{
                    console.log('Error in Pulling',err);
                })
            }
        });
    }).catch(e=>{
        console.log('Error in Accessing the api')
    });

    function gitFunction(dir,path){
        
        ncu.run({
            packageFile:path,
            jsonUpgraded: true,
            packageManager: 'npm',
            silent: true,
            upgrade:true
        }).then((upgraded) => {
            if(! (Object.keys(upgraded).length === 0 && upgraded.constructor === Object)){
                     git.add({dir,filepath:path.slice(parseInt(path.indexOf(dir))+parseInt(dir.length)+1)}).then(()=>{
                        git.commit({
                            dir,
                            author:{
                            name: 'Vikas',
                            email: 'vsvikassvs@gmail.com'
                            },
                            message:"Changed the Version of Packages using js"
                        }).then(()=>{
                            git.push({
                                dir,
                                remote: 'origin',
                                ref: 'master',
                                token: token 
                            }).then(()=>console.log(`${path}Pushed to the server`)).catch((err)=>{console.log('Error in Pushing')})
                         }).catch(()=>{
                             console.log('Error in Committing');
                         })
                  }).catch(e=>{
                      console.log('Error in Adding the file')
                  })
            }else{
                console.log(`${path} already up to date`)
            }
        });
    }
