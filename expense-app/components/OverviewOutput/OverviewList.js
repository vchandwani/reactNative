import OverviewItem from './OverviewItem';

function OverviewList({ data, isFocused }) {
    return data.map((entry, i) => {
        return <OverviewItem {...entry} key={entry.category + entry.name} />;
    });
}

export default OverviewList;
