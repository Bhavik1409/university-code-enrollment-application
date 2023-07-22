async function displayCourses() {
  try {
    const response = await fetch('/courses');
    const courses = await response.json();

    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';

    courses.forEach((course) => {
      const courseElement = document.createElement('div');
      courseElement.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p>Instructor: ${course.instructor}</p>
        <p>Capacity: ${course.capacity}</p>
        <button onclick="enroll(${course.id})">Enroll</button>
      `;
      coursesList.appendChild(courseElement);
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

async function enroll(courseId) {
  try {
    const response = await fetch(`/enroll/${courseId}`, { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      alert('Enrollment successful!');
      displayCourses();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error enrolling in the course:', error);
  }
}
window.onload = () => {
  displayCourses();
};
