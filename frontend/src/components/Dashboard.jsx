import { useState, useEffect } from 'react'

const Dashboard = ({ user, onLogout }) => {
  const [currentActivities, setCurrentActivities] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Inline styles object
  const styles = {
    dashboard: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Poppins, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    userAvatar: {
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    logoutBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    section: {
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '1.5rem'
    },
    activityCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      padding: '1.5rem',
      color: 'white',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    },
    eventCard: {
      background: 'white',
      borderRadius: '15px',
      padding: '1.5rem',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      transition: 'transform 0.3s ease'
    },
    eventDate: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '1rem',
      textAlign: 'center',
      minWidth: '70px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '20px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '20px 20px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalClose: {
      position: 'absolute',
      top: '1.5rem',
      right: '2rem',
      fontSize: '28px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      color: 'white'
    },
    modalBody: {
      padding: '2rem'
    }
  }

  useEffect(() => {
    // Sample data - replace with API calls
    setCurrentActivities([
      {
        id: 1,
        name: "Basketball Team",
        date: "2025-10-15",
        time: "6:00 PM",
        location: "Sports Complex",
        type: "Sports",
        status: "Team Captain",
        role: "Point Guard",
        contribution: "Leading team practices, organizing game strategies, mentoring new players",
        nextMeeting: "Oct 12, 4:00 PM",
        progressPercentage: 85
      },
      {
        id: 2,
        name: "Student Council",
        date: "2025-10-18",
        time: "2:00 PM",
        location: "Conference Room A",
        type: "Academic",
        status: "Active Member",
        role: "Vice President",
        contribution: "Organizing student events, representing student concerns, budget planning",
        nextMeeting: "Oct 11, 10:00 AM",
        progressPercentage: 70
      },
      {
        id: 3,
        name: "Drama Club",
        date: "2025-10-20",
        time: "7:00 PM",
        location: "Theater Hall",
        type: "Cultural",
        status: "Lead Actor",
        role: "Main Character",
        contribution: "Memorizing scripts, attending rehearsals, coordinating with other actors",
        nextMeeting: "Oct 13, 3:00 PM",
        progressPercentage: 92
      }
    ])

    setUpcomingEvents([
      {
        id: 4,
        name: "Science Fair",
        date: "2025-11-05",
        time: "10:00 AM",
        location: "Main Auditorium",
        type: "Academic"
      },
      {
        id: 5,
        name: "Cultural Fest",
        date: "2025-11-12",
        time: "6:00 PM",
        location: "Campus Grounds",
        type: "Cultural"
      },
      {
        id: 6,
        name: "Football Tournament",
        date: "2025-11-18",
        time: "4:00 PM",
        location: "Sports Field",
        type: "Sports"
      }
    ])
  }, [])

  const showCurrentActivityDetails = (activity) => {
    console.log('showCurrentActivityDetails called for', activity)
    setSelectedActivity(activity)
  }

  const showUpcomingEventDetails = (event) => {
    setSelectedEvent(event)
  }

  const closeModal = () => {
    setSelectedActivity(null)
    setSelectedEvent(null)
  }

  const getTimeUntilEvent = (eventDate) => {
    const now = new Date()
    const event = new Date(eventDate)
    const timeDiff = event.getTime() - now.getTime()
    
    if (timeDiff < 0) return "Event has passed"
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) {
      return `${days} days, ${hours} hours`
    } else if (hours > 0) {
      return `${hours} hours`
    } else {
      return "Less than an hour"
    }
  }

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <i className="fas fa-user" style={{fontSize: '1.5rem', color: 'white'}}></i>
            </div>
            <div>
              <h1 style={{fontSize: '1.8rem', fontWeight: '600', margin: '0 0 0.25rem 0'}}>
                Welcome back, {user?.name || user?.email?.split('@')[0]}!
              </h1>
              <p style={{opacity: 0.9, margin: 0}}>Ready to make today productive?</p>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Current Activities Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: '#333'}}>
              <i className="fas fa-user-check"></i> My Current Activities
            </h2>
            <p style={{color: '#666', margin: 0}}>Activities you're actively participating in right now</p>
          </div>
          <div style={styles.grid}>
            {currentActivities.map(activity => (
              <div 
                key={activity.id}
                style={styles.activityCard}
                role="button"
                tabIndex={0}
                onClick={() => showCurrentActivityDetails(activity)}
                onMouseDown={() => showCurrentActivityDetails(activity)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCurrentActivityDetails(activity) } }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <div style={{background: 'rgba(255, 255, 255, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'}}>
                    {activity.status}
                  </div>
                  <div style={{fontSize: '0.8rem', opacity: 0.9}}>Next: {activity.nextMeeting}</div>
                </div>
                <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1.3rem', fontWeight: '700'}}>{activity.name}</h4>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: '600'}}>
                  <i className="fas fa-star" style={{color: '#ffd700'}}></i> {activity.role}
                </div>
                <p style={{marginBottom: '1rem', opacity: 0.9, lineHeight: 1.4}}>{activity.contribution}</p>
                <div style={{marginBottom: '1rem'}}>
                  <div style={{background: 'rgba(255, 255, 255, 0.2)', height: '8px', borderRadius: '4px', marginBottom: '0.5rem'}}>
                    <div style={{background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', height: '100%', borderRadius: '4px', width: `${activity.progressPercentage}%`}}></div>
                  </div>
                  <span style={{fontSize: '0.8rem', fontWeight: '600'}}>{activity.progressPercentage}% Complete</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.8}}>
                  <span><i className="fas fa-clock"></i> {activity.time}</span>
                  <span><i className="fas fa-map-marker-alt"></i> {activity.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: '#333'}}>
              <i className="fas fa-calendar-alt"></i> Upcoming Events
            </h2>
            <p style={{color: '#666', margin: 0}}>New opportunities to join and explore</p>
          </div>
          <div style={styles.grid}>
            {upcomingEvents.map(event => (
              <div 
                key={event.id}
                style={styles.eventCard}
                role="button"
                tabIndex={0}
                onClick={() => showUpcomingEventDetails(event)}
                onMouseDown={() => showUpcomingEventDetails(event)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showUpcomingEventDetails(event) } }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={styles.eventDate}>
                  <div style={{fontSize: '1.5rem', fontWeight: '700', lineHeight: 1}}>{new Date(event.date).getDate()}</div>
                  <div style={{fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase'}}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                <div style={{flex: 1}}>
                  <h4 style={{margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.2rem', fontWeight: '600'}}>{event.name}</h4>
                  <div style={{display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666'}}>
                    <span><i className="fas fa-clock"></i> {event.time}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                    <span style={{background: '#f8f9fa', padding: '0.25rem 0.5rem', borderRadius: '12px'}}>{event.type}</span>
                  </div>
                </div>
                <button 
                  style={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`Joining ${event.name}...`)
                  }}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Simple Modal for Activity Details */}
      {selectedActivity && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <i className="fas fa-trophy"></i> {selectedActivity.name}
              </h2>
              <button style={styles.modalClose} onClick={closeModal}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
                <i className="fas fa-chart-line"></i> My Performance & Contribution
              </h3>
              <div style={{marginBottom: '1.5rem'}}>
                <p><strong>Role:</strong> {selectedActivity.role}</p>
                <p><strong>Progress:</strong> {selectedActivity.progressPercentage}%</p>
                <p><strong>Contributions:</strong> {selectedActivity.contribution}</p>
                <p><strong>Next Meeting:</strong> {selectedActivity.nextMeeting}</p>
                <p><strong>Location:</strong> {selectedActivity.location}</p>
              </div>
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button style={{padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer'}}>
                  View Full Report
                </button>
                <button style={{padding: '0.75rem 1.5rem', background: '#f8f9ff', color: '#667eea', border: '2px solid #667eea', borderRadius: '25px', cursor: 'pointer'}}>
                  Update Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Modal for Event Details */}
      {selectedEvent && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <i className="fas fa-calendar-plus"></i> {selectedEvent.name}
              </h2>
              <button style={styles.modalClose} onClick={closeModal}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              <h3 style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
                <i className="fas fa-clock"></i> Event Schedule
              </h3>
              <div style={{marginBottom: '1.5rem'}}>
                <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Day:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p><strong>Time:</strong> {selectedEvent.time}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Type:</strong> {selectedEvent.type}</p>
                <p><strong>Time Until Event:</strong> {getTimeUntilEvent(selectedEvent.date)}</p>
              </div>
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                <button 
                  style={{padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer'}}
                  onClick={() => alert(`Joining ${selectedEvent.name}...`)}
                >
                  Join This Event
                </button>
                <button style={{padding: '0.75rem 1.5rem', background: '#f8f9ff', color: '#667eea', border: '2px solid #667eea', borderRadius: '25px', cursor: 'pointer'}}>
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard