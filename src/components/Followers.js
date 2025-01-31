import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Followers = () => {
  const { username } = useParams();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/followers`
        );
        setFollowers(response.data);
      } catch (err) {
        setError("Could not fetch followers");
      }
    };

    fetchFollowers();
  }, [username]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{username}'s Followers</h2>
      {followers.length > 0 ? (
        <ul>
          {followers.map((follower) => (
            <li key={follower.id}>
              <img src={follower.avatar_url} alt="Avatar" width="50" />
              <p>{follower.login}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers found.</p>
      )}
    </div>
  );
};

export default Followers;
