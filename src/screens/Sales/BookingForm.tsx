/* eslint-disable react/no-unescaped-entities */
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useSyncedFields } from 'hooks/useDiscountCalculator';
import { round } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { getOtherChargesList, getUnitInfo, getUnitParkingInfo, getVisitorsList } from 'redux/sales';
import { IVisitor } from 'redux/sales/salesInterface';
import { useAppDispatch, useAppSelector } from 'redux/store';

import AddCustomerModal from './AddCustomerModal';

const BookingForm = () => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<IVisitor>();

  const toggleModal = () => setShow(!show);
  const unitId = 28;

  // visitors list
  const { visitorList, unitInfo, unitParkingInfo, otherChargesList } = useAppSelector(s => s.sales);

  // < input value = { values.amountKey } onChange = { discountSyncedFields.onChangeAmount } />
  //   <input onChange={discountSyncedFields.onChangePercent} />

  const unitInfoValues = useMemo(() => {
    return unitInfo?.booking_unit_sheet_towers_data?.find(e => e.project_main_units_id === unitId);
  }, [unitInfo?.booking_unit_sheet_towers_data]);

  const unitParkingInfoValues = useMemo(() => {
    return unitParkingInfo?.all_parking_units?.filter(e => e.allotment_data === unitId.toString());
  }, [unitParkingInfo?.all_parking_units]);

  const customerOptions = useMemo(() => {
    return visitorList?.map(e => ({
      label: `${e.first_name} ${e.last_name} - [${e.phone}]`,
      value: e.id,
      details: e,
    }));
  }, [visitorList]);

  useEffect(() => {
    dispatch(
      getVisitorsList({
        project_id: 18,
      }),
    );
    dispatch(
      getUnitInfo({
        project_id: 18,
        tower_id: 1,
      }),
    );
    dispatch(
      getUnitParkingInfo({
        project_id: 18,
      }),
    );
    dispatch(
      getOtherChargesList({
        project_id: 18,
        unit_id: unitId,
      }),
    );
  }, []);

  const initialValues = {
    project_id: 18,
    unit_id: 28,
    visitors_id: customerDetails?.id,
    unit_reserved_date: dayjs().format('YYYY-MM-DD'),
    parking_no: unitParkingInfoValues?.map(e => e.id).toString(),
    calculation_method: '',
    basic_rate_no: 1,
    basic_rate_description: 'Basic rate of unit',
    basic_rate_area: unitInfoValues?.super_build_up_area || 0,
    basic_rate: undefined,
    basic_rate_disc_amt: 0,
    basic_rate_disc_per: 0,
    basic_rate_basic_amount: undefined,
  };

  const handleSubmit = values => {
    // const {
    //   project_id,
    //   unit_id,
    //   visitors_id,
    //   unit_reserved_date,
    //   parking_no,
    //   calculation_method,
    //   basic_rate_no,
    //   basic_rate_description,
    //   basic_rate_area,
    //   basic_rate,
    //   basic_rate_disc_amt,
    //   basic_rate_disc_per,
    //   basic_rate_basic_amount,
    // } = values;
    console.log('🚀 ~ file: BookingForm.tsx:93 ~ handleSubmit ~ values:', values);
    // dispatch(
    //   addBooking({
    //     project_bookings_temp_id: 0,
    //     project_id,
    //     unit_id,
    //     visitors_id,
    //     unit_reserved_date,
    //     parking_no,
    //     calculation_method,
    //     basic_rate_no,
    //     basic_rate_description,
    //     basic_rate_area,
    //     basic_rate,
    //     basic_rate_disc_amt,
    //     basic_rate_disc_per,
    //     basic_rate_basic_amount,
    //     other_charges: [],
    //     other_charges_total: 0,
    //     sub_total_amt: 0,
    //     total_disc: 0,
    //     disc_remarks: '',
    //     gst_per: 0,
    //     gst_amt: 0,
    //     stampduty_per: 0,
    //     stampduty_amount: 0,
    //     reg_per: 0,
    //     reg_amount: 0,
    //     total_gove_tax: '',
    //     extra_charges: [],
    //     extra_charges_total: 0,
    //     property_final_amount: 0,
    //     is_loan: '',
    //     loan_amt: 0,
    //     bank: 0,
    //     loan_remarks: '',
    //     installments: [],
    //     custom_payment_total_amount: 0,
    //     custom_payment_remark_id: 0,
    //     custom_payment_remark: '',
    //   }),
    // );
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const { values, setFieldValue, handleChange, handleBlur } = formik;
  console.log("🚀 ~ file: BookingForm.tsx:154 ~ BookingForm ~ values:", values.basic_rate_basic_amount)

  const discountSyncedFields = useSyncedFields(
    formik,
    values.basic_rate_basic_amount,
    'basic_rate_disc_amt',
    'basic_rate_disc_per',
  );

  useEffect(() => {
    const { basic_rate_area, basic_rate, basic_rate_disc_amt } = values;

    if (basic_rate_area || basic_rate) {
      const basic_rate_total = round(basic_rate_area * basic_rate - basic_rate_disc_amt, 2);
      setFieldValue('basic_rate_basic_amount', basic_rate_total);
    }
  }, [values.basic_rate, values.basic_rate_area, values.basic_rate_disc_amt]);

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      basic_rate: 0,
      basic_rate_disc_amt: 0,
      basic_rate_disc_per: 0,
      basic_rate_basic_amount: 0,
    });
  }, [values.calculation_method]);

  return (
    <>
      <div className="header-bar">
        <div className="page-header">
          <button className="header-back-btn">
            <svg
              fill="none"
              height="12"
              viewBox="0 0 18 12"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 5H3.83L7.41 1.41L6 0L0 6L6 12L7.41 10.59L3.83 7H18V5Z"
                fill="#041D36"
              ></path>
            </svg>
          </button>
          <h2 className="mx-4">Booking Form</h2>
        </div>
        <div className="booking-form-header new-booking-header ml-auto px-2 py-3">
          <div className="booking-timer">
            <p>
              Time Left: <span>27 : 29</span>
            </p>
          </div>
        </div>
      </div>

      <hr />

      <section className="booking-form-sec pt-0">
        <div className="booking-form-row">
          <div className="booking-form-row-header">
            <h4>Customer Details</h4>
          </div>

          <Form onSubmit={formik.handleSubmit}>
            {/* 1st section */}
            <AddCustomerModal handleClose={toggleModal} show={show} />
            <div className="booking-form-box shwan-form">
              <div className="booking-form-col-12">
                <div className="d-flex align-items-center justify-content-between">
                  <h5>CUSTOMER DETAILS</h5>
                  <button className="Btn btn-lightblue-primary lbps-btn mr-0" onClick={toggleModal}>
                    Add Customer
                  </button>
                </div>

                <div className="form-row">
                  <div className="col-12">
                    <Select
                      closeMenuOnSelect={true}
                      options={customerOptions}
                      placeholder="Existing Customer"
                      styles={{
                        container: base => ({
                          ...base,
                          width: '31%',
                          marginTop: 10,
                          marginBottom: 50,
                        }),
                      }}
                      onChange={e => setCustomerDetails(e.details)}
                    />
                  </div>
                </div>

                {customerDetails ? (
                  <div className="form-row">
                    <div className="form-group col form-col-gap">
                      <label>Client Name</label>
                      <input
                        readOnly
                        className="form-control"
                        type="text"
                        value={`${customerDetails.first_name} ${customerDetails.last_name}`}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Phone No</label>
                      <input
                        readOnly
                        className="form-control"
                        type="text"
                        value={customerDetails.phone}
                      />
                    </div>
                    <div className="form-group col">
                      <label>Email ID</label>
                      <input
                        readOnly
                        className="form-control"
                        type="text"
                        value={customerDetails.email || ''}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 2nd section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>UNIT INFO</h5>

                <div className="form-row">
                  <div className="form-group col form-col-gap">
                    <label>Unit Reservation Date</label>
                    <input
                      className="form-control"
                      name="unit_reserved_date"
                      type="date"
                      value={formik.values.unit_reserved_date}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="form-group col">
                    <label htmlFor="inputPassword4">Unit Info</label>
                    <input
                      className="form-control"
                      readOnly={true}
                      type="text"
                      value={unitInfoValues?.title}
                    />
                  </div>
                  <div className="form-group col">
                    <label htmlFor="inputPassword4">Super Buildup Area</label>
                    <input
                      className="form-control"
                      readOnly={true}
                      type="text"
                      value={unitInfoValues?.super_build_up_area}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group col form-col-gap">
                      <label>Terrace Area</label>
                      <input
                        className="form-control"
                        readOnly={true}
                        type="text"
                        value={'pending'}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col">
                      <label>Car Parking No</label>
                      <input
                        className="form-control"
                        name="parking_no"
                        readOnly={true}
                        type="text"
                        value={formik.values.parking_no}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>RATE CALCULATION</h5>
                <div className="form-row ml-3">
                  <div className="form-group col form-col-gap">
                    <div className="row w-100">
                      <p>
                        <b>Calculation Method</b>
                      </p>
                      <Col md={2}>
                        <Form.Check
                          id="RateBased"
                          label="Rate Based"
                          name="calculation_method"
                          type="radio"
                          value={'rate_base'}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Check
                          id="fixedRate"
                          label="Fixed Amount"
                          name="calculation_method"
                          type="radio"
                          value={'fixed_amount'}
                          onChange={handleChange}
                        />
                      </Col>
                    </div>
                  </div>
                </div>
                {formik.values.calculation_method === 'rate_base' ? (
                  <div>
                    {/* Rate Based */}
                    <table className="table">
                      <thead>
                        <th>Sr No</th>
                        <th>Description</th>
                        <th>Area</th>
                        <th>Rate</th>
                        <th>Discount</th>
                        <th>Basic Amount</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>01</td>
                          <td>Basic rate of unit</td>
                          <td>
                            <input
                              className="form-control"
                              name="basic_rate_area"
                              type="text"
                              value={values.basic_rate_area}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              name="basic_rate"
                              type="text"
                              value={values.basic_rate}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control mb-2"
                              name="basic_rate_disc_amt"
                              placeholder="Amount"
                              type="text"
                              value={values.basic_rate_disc_amt}
                              onBlur={handleBlur}
                              onChange={discountSyncedFields.onChangeAmount}
                            />
                            <input
                              className="form-control"
                              name="basic_rate_disc_per"
                              placeholder="%"
                              type="text"
                              value={values.basic_rate_disc_per}
                              onBlur={handleBlur}
                              onChange={discountSyncedFields.onChangePercent}
                            />
                          </td>
                          <td>
                            <input
                              readOnly
                              className="form-control"
                              name="basic_rate_basic_amount"
                              type="text"
                              value={values.basic_rate_basic_amount}
                              onBlur={handleBlur}
                              onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : formik.values.calculation_method === 'fixed_amount' ? (
                  <div>
                    {/* Fixed Amount Based */}
                    <table className="table">
                      <thead>
                        <th>Sr No</th>
                        <th>Description</th>
                        <th>Rate</th>
                        <th>Discount</th>
                        <th>Basic Amount</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>01</td>
                          <td>Basic rate of unit</td>
                          <td>
                            <input
                              className="form-control"
                              name="basic_rate"
                              placeholder="Amount"
                              type="text"
                                value={values.basic_rate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control mb-2"
                              name="basic_rate_disc_amt"
                              placeholder="Amount"
                              type="text"
                                value={values.basic_rate_disc_amt}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            <input
                              className="form-control"
                              name="basic_rate_disc_per"
                              placeholder="%"
                              type="text"
                                value={values.basic_rate_disc_per}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                          </td>
                          <td>
                            <input
                              readOnly
                              className="form-control"
                              name="basic_rate_basic_amount"
                              type="text"
                                value={values.basic_rate_basic_amount}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : undefined}
              </div>
            </div>

            {/* 4th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>OTHER CHARGES</h5>

                <div>
                  <table className="table">
                    <thead>
                      <th>Sr No</th>
                      <th>Title</th>
                      <th>Distribution Method</th>
                      <th>Area</th>
                      <th>Rate</th>
                      <th>Discount</th>
                      <th className="text-right">Amount</th>
                    </thead>
                    <tbody>
                      {otherChargesList?.other_charge_unit_rates?.map(e => {
                        return (
                          <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.title}</td>
                            <td>
                              <select className="form-control">
                                <option value="">Equally with all installments</option>
                                <option value="">Proportionately with all installment</option>
                                <option value="">
                                  Proportionately with all installment(Except First)
                                </option>
                                <option value="">Connect with last installment</option>
                                <option value="">Don't connect with installment</option>
                              </select>
                            </td>
                            <td>
                              <input className="form-control" type="text" />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                name="calculation_method"
                                type="text"
                                value={'rate_base'}
                                onChange={formik.handleChange}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control mb-2"
                                placeholder="Amount"
                                type="text"
                              />
                              <input className="form-control" placeholder="%" type="text" />
                            </td>
                            <td>
                              <input readOnly className="form-control" type="text" />
                            </td>
                          </tr>
                        );
                      })}

                      {/* total */}
                      <tr>
                        <td className="text-right font-weight-bold" colSpan={6}>
                          Other Charges Total
                        </td>
                        <td className="text-right">₹ 10000000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 5th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-6">
                <h5>OVERALL DISCOUNT</h5>

                <div className="form-row">
                  <div className="form-group col form-col-gap">
                    <label>Sub Total Amount (Basic Amt + Other Charges)</label>
                    <input readOnly className="form-control" type="text" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col">
                    <label>Total Discount</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col">
                    <label>Discount Remark</label>
                    <textarea className="form-control" rows={3} />
                  </div>
                </div>
              </div>
            </div>

            {/* 6th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-6">
                <h5>GOVERNMENT TAXES</h5>

                <div className="form-row">
                  <div className="form-group col-3 form-col-gap">
                    <label>GST</label>
                  </div>
                  <div className="form-group col-2  pr-4">
                    <label>%</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group col-3">
                    <label>Amt</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-3 form-col-gap">
                    <label>Stamp Duty</label>
                  </div>
                  <div className="form-group col-2  pr-4">
                    <label>%</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group col-3">
                    <label>Amt</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-3 form-col-gap">
                    <label>Registration</label>
                  </div>
                  <div className="form-group col-2  pr-4">
                    <label>%</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group col-3">
                    <label>Amt</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-3 form-col-gap">
                    <label>Taxes Total</label>
                  </div>
                  <div className="form-group col-2  pr-4">
                    <label>%</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group col-3">
                    <label>Amt</label>
                    <input className="form-control" type="text" />
                  </div>
                </div>
              </div>
            </div>

            {/* 7th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>EXTRA CHARGES</h5>

                <div>
                  <table className="table">
                    <thead>
                      <th>Sr No</th>
                      <th>Title</th>
                      <th>Distribution Method</th>
                      <th>Area</th>
                      <th>Rate</th>
                      <th>Discount</th>
                      <th className="text-right">Amount</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>01</td>
                        <td>Some Extra Charges need to be added here</td>
                        <td>
                          <select className="form-control">
                            <option value="">Equally with all installments</option>
                            <option value="">Proportionately with all installment</option>
                            <option value="">
                              Proportionately with all installment(Except First)
                            </option>
                            <option value="">Connect with last installment</option>
                            <option value="">Don't connect with installment</option>
                          </select>
                        </td>
                        <td>
                          <input className="form-control mb-2" type="text" />
                        </td>
                        <td>
                          <input className="form-control mb-2" type="text" />
                        </td>
                        <td>
                          <input className="form-control mb-2" placeholder="Amount" type="text" />
                          <input className="form-control" placeholder="%" type="text" />
                        </td>
                        <td>
                          <input readOnly className="form-control mb-2" type="text" />
                        </td>
                      </tr>
                      {/* total */}
                      <tr>
                        <td className="text-right font-weight-bold" colSpan={6}>
                          Other Charges Total
                        </td>
                        <td className="text-right">Rs 10000000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 8th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>SUMMARY</h5>

                <div className="row">
                  <div className="col-4">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>Basic Amount</td>
                          <td>5000000</td>
                        </tr>
                        <tr>
                          <td>Other Charges Total</td>
                          <td>5000000</td>
                        </tr>
                        <tr>
                          <td>Total Discount (Sale Deed Amount)</td>
                          <td>5000000</td>
                        </tr>
                        <tr>
                          <td>Government Taxes Total</td>
                          <td>5000000</td>
                        </tr>
                        <tr>
                          <td>Extra Charges</td>
                          <td>5000000</td>
                        </tr>
                        <tr>
                          <td>Property Final Amount</td>
                          <td>5000000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* 9th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-6">
                <h5>LOAN DETAILS</h5>

                <div className="form-row">
                  <div className="col-6">
                    <label>Do you wish to take a loan?</label>
                    <div className="form-row">
                      <div className="col-6">
                        <div className="rd-grp form-check-inline">
                          <label className="rd-container check-yes">
                            Yes
                            <input checked={true} name="radio" type="radio" />
                            <span className="checkmark"></span>
                          </label>
                          <label className="rd-container check-no">
                            No
                            <input name="radio" type="radio" />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row mt-3">
                  <div className="form-group col form-col-gap">
                    <label>Loan Amount</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group col">
                    <label>Bank</label>
                    <select className="form-control">
                      <option value="">SBI</option>
                      <option value="">HDFC</option>
                      <option value="">Kotak</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col">
                    <label>Remarks</label>
                    <textarea className="form-control" cols={20} id="" name="" rows={10}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* 10th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>PAYMENT SCHEDULE</h5>

                <div>
                  <table className="table">
                    <thead>
                      <th>Sr No</th>
                      <th>Installment Name</th>
                      <th>Due Date</th>
                      <th>%</th>
                      <th>Basic Amount</th>
                      <th>Other Charges Amount</th>
                      <th>GST</th>
                      <th className="text-right">Installment Amount</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>01</td>
                        <td>Installment Will be here</td>
                        <td>
                          <input className="form-control" type="date" />
                        </td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                        <td>
                          <input className="form-control" type="text" />
                        </td>
                        <td>
                          <input readOnly className="form-control" type="text" />
                        </td>
                      </tr>
                      {/* total */}
                      <tr>
                        <td className="text-right font-weight-bold" colSpan={7}>
                          Other Charges Total
                        </td>
                        <td className="text-right">Rs 10000000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 11th section */}
            <div className="booking-form-box shwan-form mt-4">
              <div className="booking-form-col-12">
                <h5>TERMS & CONDITIONS</h5>

                <div className="form-row mb-4">
                  <div className="col-4">
                    <label>Select T&C Template</label>
                    <select className="form-control">
                      <option value="0">Select T&C</option>
                      <option value="1">A</option>
                      <option value="2">B</option>
                      <option value="3">C</option>
                    </select>
                  </div>
                </div>

                <textarea className="form-control" rows={4}></textarea>
              </div>

              <div className="booking-form-col-12">
                <div className="form-row mb-4">
                  <div className="bookingform-footer mt-5">
                    <button className="Btn btn-lightblue-primary" type="submit">
                      Save
                    </button>
                    <button
                      className="Btn btn-lightblue-primary lbps-btn"
                      data-dismiss="modal"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </section>
    </>
  );
};

export default BookingForm;
