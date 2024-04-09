// Función para generar un UUID con un formato de fecha y hora específico
export default function generateUUIDWithTimestampFormat() {
    var d = new Date();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d.getTime() + Math.random() * 16) % 16 | 0;
      d.setTime(d.getTime() + 1); // Incrementamos el tiempo para garantizar la unicidad del UUID en un mismo milisegundo
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    
    // Formateamos la fecha y hora actual
    var formattedDate = d.getFullYear() + 
                        ('0' + (d.getMonth() + 1)).slice(-2) + 
                        ('0' + d.getDate()).slice(-2) +
                        '_' +
                        ('0' + d.getHours()).slice(-2) +
                        ('0' + d.getMinutes()).slice(-2) +
                        ('0' + d.getSeconds()).slice(-2);
  
    return formattedDate + '_' + uuid;
  }
  