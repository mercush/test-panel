import React from "react";
import { create } from "react-test-renderer";

function OmniSearch(props) {
    return <OmniSearch>Test</OmniSearch>
}

describe("Omnisearch component", () => {
    test("Matches the snapshot", () => {
        const omnisearch = create(<OmniSearch />);
        expect(omnisearch.toJSON()).toMatchSnapshot();
    });
});