import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 } from "uuid";
import config from "../config";
import useAppContext from "../hooks/useAppContext";
import { getOthers } from "../services/userService";
import Search from "./Search";
import PersonCard from "./PersonCard";
import Pagination from "./Pagination";
// import * as css from "../styles/People.module.css";
import stubImage from "../assets/stub.png";

export default function People() {
  const isMounted = useRef(false);
  const { selfId } = useAppContext();
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(true);

  const refresh = (others) => {
    setPeople(others);
    setPage(others.slice(0, config.peoplePerPage));
  };

  // on mount
  useEffect(() => {
    getOthers(selfId, "select=_id,name,image,about")
      .then((others) => {
        refresh(others);
        isMounted.current = true;
      });
  }, []);

  // on change people
  useEffect(() => {
    if (isMounted.current) setSearchDisabled(people.length === 0);
  }, [people]);

  const onSearch = useCallback(async () => {
    const others = (
      people.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
    );
    refresh(others);
  }, [people, searchValue]);

  const onClear = useCallback(async () => {
    const others = await getOthers(selfId, "select=_id,name,image,about");
    refresh(others);
  }, []);

  const cardsComponent = useMemo(() => page.map(({ _id, image, name, about }) => (
    <PersonCard key={v4()} ownerId={_id} image={image || stubImage} name={name} about={about} />
  )), [page]);

  return isMounted.current ? (
    <div>
      <Search
        value={searchValue}
        setValue={setSearchValue}
        onSearch={onSearch}
        onClear={onClear}
        disabled={searchDisabled}
      />
      {cardsComponent}
      <Pagination items={people} itemsPerPage={config.peoplePerPage} setPage={setPage} />
    </div>
  ) : null;
}
