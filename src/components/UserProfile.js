import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolderOpen, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const UserProfile = ({ username }) => {
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showRepos, setShowRepos] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [totalRepos, setTotalRepos] = useState(0);

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        setUserData(userResponse.data);
        setTotalRepos(userResponse.data.public_repos);
        setError(null);
      } catch (err) {
        setError("User not found or invalid username.");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (!username || !showRepos) return;

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const repoResponse = await axios.get(
          `https://api.github.com/users/${username}/repos?page=${page}&per_page=30&sort=stars&direction=${sortOrder}`
        );
        setRepositories(repoResponse.data);
      } catch (err) {
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [username, page, sortOrder, showRepos]);

  // followers
  useEffect(() => {
    if (!username || !showFollowers) return;

    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const followerResponse = await axios.get(
          `https://api.github.com/users/${username}/followers`
        );
        setFollowers(followerResponse.data);
      } catch (err) {
        setFollowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [username, showFollowers]);

  const goToProfile = (username) => {
    window.location.href = `/profile/${username}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={userData.avatar_url} alt="Avatar" className="profile-avatar" />
        <h2 className="profile-name">{userData.name || "No Name Provided"}</h2>
        <p className="profile-location">📍 {userData.location || "Unknown"}</p>
        <p className="profile-role">@{userData.login}</p>
        <p>{userData.bio || "No bio available"}</p>
        <div className="profile-stats">
          <div>
            <strong>{userData.public_repos}</strong>
            <p>Repositories</p>
          </div>
          <div>
            <strong>{userData.followers}</strong>
            <p>Followers</p>
          </div>
        </div>

        <button className="repo-toggle" onClick={() => setShowRepos(!showRepos)}>
          <FaFolderOpen size={20} /> {showRepos ? "hide repositories" : "show repositories"}
        </button>

        <button className="repo-toggle" onClick={() => setShowFollowers(!showFollowers)}>
          <FaFolderOpen size={20} /> {showFollowers ? "hide followers" : "show followers"}
        </button>

        <button className="profile-button" onClick={() => goToProfile(userData.login)}>
          HOMEPAGE
        </button>

        {showRepos && (
          <div className="repositories">
            <h3>Repositories</h3>
            <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />} Sort by Stars
            </button>
            {repositories.length > 0 ? (
              <ul className="repo-list">
                {repositories.map(repo => (
                  <li key={repo.id} className="repo-item">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                    <p>{repo.description || "No description available"}</p>
                    <p>🌟 {repo.stargazers_count} | {repo.forks_count} | {repo.language || "N/A"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No repositories found</p>
            )}
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
              <span>Page {page}</span>
              <button onClick={() => setPage(page + 1)} disabled={page * 30 >= totalRepos}>Next</button>
            </div>
          </div>
        )}

        {showFollowers && (
          <div className="followers">
            <h3>Followers</h3>
            {followers.length > 0 ? (
              <ul className="repo-list">
                {followers.map(follower => (
                  <li key={follower.id} className="repo-item">
                    <img src={follower.avatar_url} alt="Follower Avatar" className="follower-avatar" />
                    <a href={follower.html_url} target="_blank" rel="noopener noreferrer">{follower.login}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No followers found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;