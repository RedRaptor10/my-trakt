const Profile = ({user}) => {
    const parseISOString = s => {
        const d = new Date(s);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        return month + '/' + day + '/' + year;
    };

    const capitalize = s => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    return (
        <div className="profile">
            <div><label>Name:</label>{user.name ? user.name : 'N/A'}</div>
            <div><label>Age:</label>{user.age ? user.age : 'N/A'}</div>
            <div><label>Gender:</label>{user.gender ? capitalize(user.gender) : 'N/A'}</div>
            <div><label>Joined:</label>{parseISOString(user.joined_at)}</div>
            <div><label>Location:</label>{user.location ? user.location : 'N/A'}</div>
            <div><label>About:</label>
                <div>{user.about ? user.about : null}</div>
            </div>
        </div>
    );
};

export default Profile;