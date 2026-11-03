export default function TaskSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Загрузка задач">
      {Array.from({ length: count }, (_, i) => (
        <div className="card card--skeleton" key={i} aria-hidden="true">
          <div className="card__photo sk" />
          <div className="card__body">
            <div className="sk sk--line" style={{ width: '70%' }} />
            <div className="sk sk--line" style={{ width: '95%' }} />
            <div className="sk sk--line" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
