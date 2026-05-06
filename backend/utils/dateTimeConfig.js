// Configure the datetime
exports.datetimeConfig = () => {
    const dateObject = new Date()
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: '2-digit', 
        minute: '2-digit'
    }
    return dateObject.toLocaleDateString("fr-FR", options).replace(':', 'h')
}