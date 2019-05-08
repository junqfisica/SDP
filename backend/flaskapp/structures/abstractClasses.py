
class AbstractStructure:
    pass

    @classmethod
    def from_dict(cls, dictionary: dict):
        """
        Map a dictionary to this class and return an instance of this class.

        :param dictionary: The dictionary to map the class.
        :return: An instance of this class.
        """
        raise NotImplementedError("The child class must implement this method.")

    def to_dict(self):
        """
        Map this object to a dictionary.

        :return: The dictionary representation of this object.
        """
        raise NotImplementedError("The child class must implement this method.")
