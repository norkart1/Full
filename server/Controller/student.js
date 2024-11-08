const Student = require('../Model/student')

module.exports ={ 
    addStudent :async(req,res)=>{
        try {
            const { name, age, image, team, ageGroup } = req.body;
        
            const newStudent = new Student({
              name,
              age,
              image,
              team,
              ageGroup,
            });
        
            const savedStudent = await newStudent.save();
            res.status(201).json(savedStudent);
          } catch (error) {
            console.error('Error creating student:', error);
            res.status(500).json({ message: 'Failed to create student.' });
          }
    },

    updateStudent:async(req,res)=>{
        try {
            const updatedStudent = await Student.findByIdAndUpdate(
              req.params.id,
              req.body,
              { new: true, runValidators: true }
            ).populate('team', 'name');
        
            if (!updatedStudent) {
              return res.status(404).json({ message: 'Student not found.' });
            }
        
            res.status(200).json(updatedStudent);
          } catch (error) {
            console.error('Error updating student:', error);
            res.status(500).json({ message: 'Failed to update student.' });
          }
    },

    getStudents : async(req,res)=>{try {
        const students = await Student.find().populate('team', 'name'); // Populating team details
        res.status(200).json(students);
      } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students.' });
      }},
    getStudentById:async(req,res)=>{try {
        const student = await Student.findById(req.params.id).populate('team', 'name'); // Populating team details
    
        if (!student) {
          return res.status(404).json({ message: 'Student not found.' });
        }
    
        res.status(200).json(student);
      } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Failed to fetch student.' });
      }},
    deleteStudentById:async(req,res)=>{try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    
        if (!deletedStudent) {
          return res.status(404).json({ message: 'Student not found.' });
        }
    
        res.status(200).json({ message: 'Student deleted successfully.' });
      } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Failed to delete student.' });
      }}
}