const Project = require('../models/projectModel');
const User = require('../models/userModel');
const {v4: uuidv4} = require('uuid')

const projects = async () => await Project.find({}).populate("members")
const getProject = async (id) => await Project.findOne({id})
const getActiveProjects = async () => await Project.find({"isActive":true})
const getInactiveProjects = async () => await Project.find({"isActive":false})
const myProjects = async (leader) => await Project.find({leader})

const createProject = (project) => {
    const newProject = new Project(project);
    newProject.id=uuidv4()
    return newProject.save()
        .then(u => "Project created")

}

const activateProject = async (id) => {
    const u = await Project.updateOne({id}, { $set: { isActive: true}})
    return "Proyecto habilitado";
}
const stopProject = async (id) => {
    const u = await Project.updateOne({ id }, { $set: { isActive: false } });
    return "Proyecto deshabilitado";

}

const resumeProject = async (title) => {
    try {
        const u = await Project.updateOne({ title }, { $set: { isActive: true } });
        return "Project: Resumed";
    } catch (err) {
        return "Project: Error";
    }
}

const updateProject = async (id, newProjectData) => {
    try {
        Project.updateOne({id}, {title: newProjectData.title, general_objective:newProjectData.general_objective , specific_objectives:newProjectData.specific_objectives, leader:newProjectData.leader, description:newProjectData.description})
            .then("Project updated")
    } catch (err) {
        return console.log(err)
    }
}

const addprogress = async (id, progress) => {
    try {
        const u = await Project.updateOne({id}, {$push: {progress}})
            .then(r => "Progreso añadido")
    } catch (err) {
        return console.log(err)
    }
}

const registerToProject = async (id, user) => {
    try {
        const u = await Project.updateOne({id}, {$push: {Pending_approval:user}})
            .then(r => "Inscripción realizada")
    } catch(err) {
        return console.log(err)
    }
}

const popLastProgress = async (id) => {
    try {
        const u = await Project.updateOne({id}, {$pop: {progress:1}})
            .then(r => "Progreso deshecho")
    } catch (err) {
        return console.log(err)
    }
}


const addUserToProject = async(id, titleProject) => {
    const user = await User.findOne({id})
    if (user && user.accountStatus == "Activa"){
        const project = await Project.findOne({title: titleProject})
        if (project && project.isActive){
            if(project.members.find(i => i == user.id)){
                return console.log("El usuario ya se encuentra registrado")
            } else {
                await Project.updateOne({title:titleProject}, {$push:{members: user._id}})
            }
        } else {
            return console.log("Por el momento no se pueden adicionar miembros al proyecto")
        }
    } else {
        console.log("El usuario a registrar en el proyecto es inválido")
    }
}



module.exports = {
    projects,
    getProject,
    createProject,
    stopProject,
    resumeProject,
    addUserToProject,
    addprogress,
    popLastProgress,
    updateProject,
    getActiveProjects,
    getInactiveProjects,
    activateProject,
    myProjects,
    registerToProject
}