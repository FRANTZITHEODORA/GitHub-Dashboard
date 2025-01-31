import React, { useEffect, useState } from 'react';

const Repositories = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&page=${page}&sort=stars&direction=${sortOrder}`);
        if (!response.ok) throw new Error('Πρόβλημα με την ανάκτηση των repositories');
        const data = await response.json();
        setRepos(data);
        
        // Έλεγχος για το πλήθος των σελίδων
        const linkHeader = response.headers.get('link');
        const lastPageMatch = linkHeader?.match(/page=(\d+)>; rel="last"/);
        setTotalPages(lastPageMatch ? parseInt(lastPageMatch[1]) : 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, page, sortOrder]);

  if (loading) return <div>Φόρτωση...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="repositories-container">
      <h2>Repositories</h2>

      <div className="sort-buttons">
        <button onClick={() => setSortOrder('asc')}>Sort by Stars Ascending</button>
        <button onClick={() => setSortOrder('desc')}>Sort by Stars Descending</button>
      </div>

      {repos.length === 0 ? (
        <p>Ο χρήστης δεν έχει repositories.</p>
      ) : (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id} className="repo-card">
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
              <p>Stars: {repo.stargazers_count}</p>
              <p>Forks: {repo.forks_count}</p>
              <p>Created at: {new Date(repo.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Repositories;