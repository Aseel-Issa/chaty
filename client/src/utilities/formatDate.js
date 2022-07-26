

export default function formatDate(createdAt){
    const createdDate = new Date(createdAt)
    const today = new Date()
    const isToday = createdDate.getFullYear() == today.getFullYear() && createdDate.getMonth() == today.getMonth() && createdDate.getDate() == today.getDate()
    return isToday ? createdDate.getHours() + ':' +createdDate.getMinutes() : createdDate.getDate() + '/' + createdDate.getMonth() + '/' + createdDate.getFullYear()
}