import { Link } from 'react-router-dom';
import { EmptyBlock } from '../components/StateBlocks';

export default function NotFound() {
  return (
    <EmptyBlock title="404 — такой страницы нет">
      <Link to="/" className="btn">На главную</Link>
    </EmptyBlock>
  );
}
