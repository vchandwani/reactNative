import { FlatList } from 'react-native';

import OverviewItem from './OverviewItem';

function renderOverviewItem(itemData) {
    return <OverviewItem {...itemData.item} />;
}

function OverviewList({ data, isFocused }) {
    return (
        <>
            <FlatList
                data={data}
                renderItem={renderOverviewItem}
                keyExtractor={(item) => item.name}
                extraData={isFocused}
            />
        </>
    );
}

export default OverviewList;
