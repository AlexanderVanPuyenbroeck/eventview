// Load the JSON file
fetch('eventsData.json')
    .then(response => response.json())
    .then(data => {
        // Process and display the events
        displayEvents(data);
    })
    .catch(error => console.error('Error loading JSON:', error));

function displayEvents(events) {
    // Create an object to group events by day
    const groupedEvents = {};

    events.forEach(event => {
        // Check if eventDate is available
        let eventStartDate;
        if (event.eventDate) {
            if (typeof event.eventDate === 'string') {
                // Single date format
                eventStartDate = new Date(event.eventDate);
            } else if (event.eventDate.start) {
                // Event with start and end
                eventStartDate = new Date(event.eventDate.start);
            }

            if (eventStartDate) {
                const eventDateStr = eventStartDate.toISOString().split('T')[0]; // Use YYYY-MM-DD format
                if (!groupedEvents[eventDateStr]) {
                    groupedEvents[eventDateStr] = [];
                }
                groupedEvents[eventDateStr].push(event);
            }
        }
    });

    // Sort events by start time within each day
    for (const date in groupedEvents) {
        groupedEvents[date].sort((a, b) => {
            const startA = a.eventDate && (a.eventDate.start ? new Date(a.eventDate.start) : new Date(a.eventDate)) || null;
            const startB = b.eventDate && (b.eventDate.start ? new Date(b.eventDate.start) : new Date(b.eventDate)) || null;
            return startA - startB;
        });
    }

    // Sort dates in chronological order
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    // Generate HTML for each day
    const container = document.getElementById('event-schedule');
    container.innerHTML = ''; // Clear previous content if needed
    sortedDates.forEach(date => {
        const daySection = document.createElement('div');
        daySection.classList.add('day-section');

        // Day heading
        const dayHeading = document.createElement('h2');
        const displayDate = new Date(date).toLocaleDateString(); // Format for display
        dayHeading.textContent = displayDate;
        daySection.appendChild(dayHeading);

        // Events for that day
        groupedEvents[date].forEach(event => {
            const eventLink = document.createElement('a');
            eventLink.href = event.eventUrl || '#'; // Default to '#' if eventUrl is missing
            eventLink.target = '_blank'; // Open in a new tab
            eventLink.classList.add('event-link'); // Optional: add a class for styling

            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');

            // Event title
            const eventTitle = document.createElement('h3');
            eventTitle.textContent = event.title || 'No Title';
            eventDiv.appendChild(eventTitle);

            // Event image
            if (event.image) {
                const eventImage = document.createElement('img');
                eventImage.src = event.image;
                eventDiv.appendChild(eventImage);
            }

            // Event location
            if (event.location) {
                const eventLocation = document.createElement('p');
                eventLocation.textContent = `Location: ${event.location}`;
                eventDiv.appendChild(eventLocation);
            }

            // Event organizers
            if (event.organizers && event.organizers.length > 0) {
                const eventOrganizers = document.createElement('p');
                eventOrganizers.textContent = `Organizers: ${event.organizers.join(', ')}`;
                eventDiv.appendChild(eventOrganizers);
            }

            // Event time
            const eventTime = document.createElement('p');
            const startTime = event.eventDate && (event.eventDate.start ? new Date(event.eventDate.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }) : new Date(event.eventDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })) || 'No Start Time';
            const endTime = event.eventDate && event.eventDate.end ? new Date(event.eventDate.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }) : 'No End Time';
            eventTime.textContent = `Time: ${startTime} - ${endTime}`;
            eventDiv.appendChild(eventTime);

            // Append eventDiv to eventLink
            eventLink.appendChild(eventDiv);

            // Append eventLink to the day section
            daySection.appendChild(eventLink);
        });

        // Append day section to the container
        container.appendChild(daySection);
    });
}
