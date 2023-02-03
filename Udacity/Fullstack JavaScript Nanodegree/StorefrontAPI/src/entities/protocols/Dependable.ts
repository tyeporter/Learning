import BusinessUsable from './BusinessUsable';
import DataStorable from './DataStorable';

interface Dependable<T> {
    repository?: DataStorable<T>;
    useCase?: BusinessUsable<T>;
}

export default Dependable;
