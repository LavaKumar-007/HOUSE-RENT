function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state glass-card">
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
