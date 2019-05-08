import traceback
from typing import NamedTuple

from flaskapp import app_logger
from flaskapp.http_util.exceptions import AppException
from flaskapp.structures.abstractClasses import AbstractStructure


def validate_dictionary(cls: NamedTuple, dic: dict):
    """
     Force the dictionary to have the same type of the parameter's declaration.

    :param cls: Expect a NamedTuple derived class.
    :param dic: The dictionary to be validate.
    :return: A new dictionary that try to keeps the same data type from this class parameters.
    """
    valid_dic = {}
    fields_list_lower = [k.lower() for k in cls._fields]
    for k in dic.keys():
        index = fields_list_lower.index(k.lower())  # Compare all in lower case. Avoid Caps sensitive.
        safe_key = cls._fields[index]

        if cls._field_types.get(safe_key) == int:
            valid_dic[safe_key] = int(dic.get(k))
        elif cls._field_types.get(safe_key) == float:
            valid_dic[safe_key] = float(dic.get(k))
        elif cls._field_types.get(safe_key) == bool:
            valid_dic[safe_key] = True if dic.get(k).capitalize() == "True" else False
        elif cls._field_types.get(safe_key) == str:
            if dic.get(k) == "null":
                valid_dic[safe_key] = None
            else:
                valid_dic[safe_key] = str(dic.get(k))
        else:
            valid_dic[safe_key] = dic.get(k)
    return valid_dic


class Search(AbstractStructure, NamedTuple):
    """
    Class that holds a structure to perform search and paginate it. This structure can
    be used by any :class:`BaseModel`, since SearchBy and OrderBy are valid column names.
    Use the method from_dict to create an instance from a dictionary.

    Fields:
        SearchBy: A table's column's name to search. You can pass multiple values by using comma separation.
            e.g: "username, name", it will perform a search in this to columns.

        SearchValue: The value to search. You can pass multiple values by using comma separation.
            e.g: "John, Sara", it will perform a search for this values for the given columns.

        Page: The current page to return.

        PerPage: Number of items per page.

        OrderBy: A table's column's name to order.

        OrderDesc: True if the order must be descendant.

        MapColumnAndValue (default = False): If True it will consider a 1:1 mapping for SearchBy:SearchValue.
            e.g: Column -> "username, name", Values -> "admin, Sara".

            If True: This will search for username = like(%admin%) and name = like(%Sara%).

            If False: This will search for username = like(%admin%, %Sara%) and name = like(%admin%, %Sara%).

        Use_AND_Operator (default = False): Makes the search with AND instead of OR.
    """

    SearchBy: str
    SearchValue: str
    Page: int
    PerPage: int
    OrderBy: str
    OrderDesc: bool = False
    MapColumnAndValue: bool = False
    Use_AND_Operator: bool = False

    def to_dict(self):
        return self._asdict()

    # noinspection PyTypeChecker
    @classmethod
    def from_dict(cls, dictionary):
        try:
            new_d = validate_dictionary(cls, dictionary)
            return cls(**new_d)

        except Exception as error:
            # traceback.print_exc(limit=2, file=sys.stdout)
            app_logger.error(traceback.format_exc())
            raise AppException(str(error))


class SearchResult(AbstractStructure, NamedTuple):
    """
    Class that holds a structure to return a search result.

    Fields:
        result: Expect a list of entities. However, it can be any object list that implements the method to_dict().

        total: The total number of entities found.
    """

    result: any
    total: int

    def to_dict(self) -> dict:
        """
        Map this object to a dictionary.

        :return: The dictionary representation of this object.
        """
        search_result_asdict = self._asdict()
        search_result_asdict["result"] = [entity.to_dict() for entity in self.result]
        return search_result_asdict

    # noinspection PyTypeChecker
    @classmethod
    def from_dict(cls, dictionary):
        try:
            new_d = validate_dictionary(cls, dictionary)
            return cls(**new_d)

        except Exception as error:
            app_logger.error(traceback.format_exc())
            raise AppException(str(error))
