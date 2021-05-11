import { actions as searchActions } from "./SearchContacts";
import { actions as contactDetailsActions } from "./ContactDetails";

export const updateSearchPhrase = newPhrase =>
  (dispatch, getState, { httpApi }) => {
    dispatch(
      searchActions.updateSearchPhraseStart({ newPhrase }),
    );

    setTimeout(() => httpApi.getFirst5MatchingContacts({ namePart: newPhrase })
      .then(({ data }) => {
        const matchingContacts = data.map(contact => ({
          id: contact.id,
          value: contact.name,
        }));
        // TODO something is wrong here //Fixed
        dispatch(
          searchActions.updateSearchPhraseSuccess({ matchingContacts: matchingContacts }),
        );
      })
      .catch(() => {
        // TODO something is missing here //Fixed
        searchActions.updateSearchPhraseFailure()
      }), 300)
  };

export const selectMatchingContact = selectedMatchingContact =>
  (dispatch, getState, { httpApi, dataCache }) => {
    // TODO something is missing here //Fixed
    const getContactDetails = ({ id }) => {
      if(dataCache.load({key:id})) {
        return new Promise((resolve, reject) => {
          dataCache.load({key:id}) ? resolve(dataCache.load({key:id})) : reject(new Error("Whoops!"));
        })
      }

      return httpApi
        .getContact({ contactId: selectedMatchingContact.id })
        .then(({ data }) => ({
          id: data.id,
          name: data.name,
          phone: data.phone,
          addressLines: data.addressLines,
        }))
    };

    dispatch(
      searchActions.selectMatchingContact({ selectedMatchingContact }),
    );

    dispatch(
      contactDetailsActions.fetchContactDetailsStart(),
    );

    getContactDetails({ id: selectedMatchingContact.id })
      .then((contactDetails) => {
        // TODO something is missing here //Fixed
        dataCache.store({
          key: contactDetails.id,
          value: contactDetails
        });
        // TODO something is wrong here //Fixed
        dispatch(
          contactDetailsActions.fetchContactDetailsSuccess({contactDetails: contactDetails}),
        );
      })
      .catch(() => {
        dispatch(
          contactDetailsActions.fetchContactDetailsFailure()
        );
      });
  };
